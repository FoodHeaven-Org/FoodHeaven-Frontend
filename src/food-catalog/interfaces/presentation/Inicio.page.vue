<script setup>
import PvHeader from '@/food-catalog/interfaces/presentation/Header.component.vue'
import PvDesayunos from '@/food-catalog/interfaces/presentation/Desayunos.component.vue'
import PvAlmuerzos from '@/food-catalog/interfaces/presentation/Almuerzos.component.vue'
import PvCenas from '@/food-catalog/interfaces/presentation/Cenas.component.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'
import { ComidasApiService } from '@/food-catalog/application/internal/comidas-api.service.js'
import { toComidaEntitiesFromResponse } from '@/food-catalog/application/internal/comida-resource.transform.js'
import { MealPlanApiService } from '@/meal-plans/application/internal/meal-plan-api.service.js'
import {
  areMealSlotsEqual,
  createEmptyMealSlots,
  EMPTY_MEAL_SLOT,
  findPlanForWeek,
  getCurrentWeekRange,
  getMealSlotIndex,
  getPlanId,
  getPlanMeals,
  toBackendDate,
  trimMealSlotsToDailyLimit,
  trimMealSlotsToDailyLimitFromDay
} from '@/meal-plans/application/internal/weekly-plan.helpers.js'
import { getSubscriptionPlan } from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'

const { t } = useI18n()
const accountApiService = new AccountApiService()
const comidasApiService = new ComidasApiService()
const mealPlanApiService = new MealPlanApiService()
const { monday, nextMonday, todayIndex } = getCurrentWeekRange()
const nextWeekMonday = new Date(nextMonday)
const followingMonday = new Date(nextWeekMonday)
followingMonday.setDate(nextWeekMonday.getDate() + 7)

const firstEditableDayIndex = todayIndex < 6 ? todayIndex + 1 : todayIndex
const selectedDay = ref(firstEditableDayIndex)
const currentPlanId = ref(null)
const nextWeekPlanId = ref(null)
const mealSlots = ref(createEmptyMealSlots())
const nextWeekMealSlots = ref(createEmptyMealSlots())
const isLoadingPlan = ref(true)
const isSavingPlan = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const subscriptionPlan = ref(getSubscriptionPlan('Full'))
const blockedMealTypeId = ref(null)
const mealsAvailable = ref(0)
const selectedDayAppliesNextWeek = computed(() => selectedDay.value <= todayIndex)
const activeMealSlotsForSelectedDay = computed(() =>
    selectedDayAppliesNextWeek.value ? nextWeekMealSlots.value : mealSlots.value
)

const selectedMealsByType = computed(() => ({
  1: activeMealSlotsForSelectedDay.value[getMealSlotIndex(1, selectedDay.value)],
  2: activeMealSlotsForSelectedDay.value[getMealSlotIndex(2, selectedDay.value)],
  3: activeMealSlotsForSelectedDay.value[getMealSlotIndex(3, selectedDay.value)]
}))

const activeWeekMealSlots = computed(() =>
    selectedDayAppliesNextWeek.value ? nextWeekMealSlots.value : mealSlots.value
)
const activeSelectedSlotsCount = computed(() => activeWeekMealSlots.value.filter(mealId => mealId > 0).length)
const weeklySlotsLimit = computed(() => subscriptionPlan.value.mealsPerDay * 7)
const progressPercent = computed(() => {
  const limit = weeklySlotsLimit.value
  if (!limit) return 0
  return Math.min(100, Math.round((activeSelectedSlotsCount.value / limit) * 100))
})
const subscriptionPlanName = computed(() => t(subscriptionPlan.value.nameKey))
const progressLabel = computed(() =>
    selectedDayAppliesNextWeek.value ? t('planner.nextWeekProgress') : t('planner.progress')
)
const slotsSelectedLabel = computed(() =>
    selectedDayAppliesNextWeek.value ? t('planner.nextWeekSlotsSelected') : t('planner.slotsSelected')
)

onBeforeMount(async () => {
  await loadCurrentWeekPlan()
})

async function loadCurrentWeekPlan() {
  isLoadingPlan.value = true
  errorMessage.value = ''

  try {
    const [plans, profile, mealsResponse] = await Promise.all([
      mealPlanApiService.getCurrentUserMealPlans(),
      accountApiService.getCurrentProfile(),
      comidasApiService.getAllMeals()
    ])
    subscriptionPlan.value = getSubscriptionPlan(profile.subscription)
    mealsAvailable.value = toComidaEntitiesFromResponse(mealsResponse).length

    const currentPlan = findPlanForWeek(plans, monday, nextMonday)
    const nextWeekPlan = findPlanForWeek(plans, nextWeekMonday, followingMonday)
    let currentWeekSlots = createEmptyMealSlots()

    if (currentPlan) {
      currentPlanId.value = getPlanId(currentPlan)
      const planMealSlots = getPlanMeals(currentPlan)
      const trimmedMealSlots = trimMealSlotsToDailyLimitFromDay(
          planMealSlots,
          subscriptionPlan.value.mealsPerDay,
          todayIndex + 1
      )
      currentWeekSlots = trimmedMealSlots
      mealSlots.value = trimmedMealSlots

      if (!areMealSlotsEqual(planMealSlots, trimmedMealSlots)) {
        await mealPlanApiService.updateWeeklyMealPlan(currentPlanId.value, {
          fechaInicio: toBackendDate(monday),
          fechaFin: toBackendDate(nextMonday),
          listaComidas: trimmedMealSlots
        })

        statusMessage.value = t('planner.adjustedToPlan')
      }
    } else {
      currentPlanId.value = null
      mealSlots.value = currentWeekSlots
    }

    if (nextWeekPlan) {
      nextWeekPlanId.value = getPlanId(nextWeekPlan)
      const planMealSlots = getPlanMeals(nextWeekPlan)
      const trimmedMealSlots = trimMealSlotsToDailyLimit(planMealSlots, subscriptionPlan.value.mealsPerDay)
      nextWeekMealSlots.value = trimmedMealSlots

      if (!areMealSlotsEqual(planMealSlots, trimmedMealSlots)) {
        await mealPlanApiService.updateWeeklyMealPlan(nextWeekPlanId.value, {
          fechaInicio: toBackendDate(nextWeekMonday),
          fechaFin: toBackendDate(followingMonday),
          listaComidas: trimmedMealSlots
        })
      }
    } else {
      nextWeekPlanId.value = null
      nextWeekMealSlots.value = trimMealSlotsToDailyLimit(currentWeekSlots, subscriptionPlan.value.mealsPerDay)
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = t('planner.loadError')
  } finally {
    isLoadingPlan.value = false
  }
}

async function handleMealSelected({ mealTypeId, mealId }) {
  if (isLoadingPlan.value || isSavingPlan.value) return

  statusMessage.value = ''
  errorMessage.value = ''
  blockedMealTypeId.value = null

  const targetMealSlots = activeMealSlotsForSelectedDay.value
  const slotIndex = getMealSlotIndex(mealTypeId, selectedDay.value)
  const currentMealId = targetMealSlots[slotIndex]
  const nextMealId = currentMealId === mealId ? EMPTY_MEAL_SLOT : mealId

  if (nextMealId > 0 && currentMealId <= 0 && getSelectedMealsForDay(selectedDay.value, targetMealSlots) >= subscriptionPlan.value.mealsPerDay) {
    blockedMealTypeId.value = mealTypeId
    errorMessage.value = t('planner.limitReached', { meals: subscriptionPlan.value.mealsPerDay })
    return
  }

  const nextSlots = [...targetMealSlots]
  nextSlots[slotIndex] = nextMealId

  if (selectedDayAppliesNextWeek.value) {
    nextWeekMealSlots.value = nextSlots
    await persistNextWeekPlan()
    return
  }

  mealSlots.value = nextSlots
  await persistCurrentPlan()
}

function getSelectedMealsForDay(dayIndex, slots = mealSlots.value) {
  return [1, 2, 3].filter(mealTypeId => slots[getMealSlotIndex(mealTypeId, dayIndex)] > 0).length
}

function isMealTypeBlocked(mealTypeId) {
  const targetMealSlots = activeMealSlotsForSelectedDay.value

  return blockedMealTypeId.value === mealTypeId
      && selectedMealsByType.value[mealTypeId] <= 0
      && getSelectedMealsForDay(selectedDay.value, targetMealSlots) >= subscriptionPlan.value.mealsPerDay
}

watch(selectedDay, () => {
  blockedMealTypeId.value = null
})

async function persistCurrentPlan() {
  isSavingPlan.value = true
  errorMessage.value = ''
  statusMessage.value = ''

  const payload = {
    fechaInicio: toBackendDate(monday),
    fechaFin: toBackendDate(nextMonday),
    listaComidas: mealSlots.value
  }

  try {
    if (currentPlanId.value) {
      await mealPlanApiService.updateWeeklyMealPlan(currentPlanId.value, payload)
    } else {
      const createdPlan = await mealPlanApiService.createWeeklyMealPlan(payload)
      currentPlanId.value = getPlanId(createdPlan)
      mealSlots.value = getPlanMeals(createdPlan)
    }

    statusMessage.value = t('planner.saved')
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.detail
        ?? error.response?.data?.message
        ?? (typeof error.response?.data === 'string' ? error.response.data : t('planner.saveError'))
  } finally {
    isSavingPlan.value = false
  }
}

async function persistNextWeekPlan() {
  isSavingPlan.value = true
  errorMessage.value = ''
  statusMessage.value = ''

  const payload = {
    fechaInicio: toBackendDate(nextWeekMonday),
    fechaFin: toBackendDate(followingMonday),
    listaComidas: nextWeekMealSlots.value
  }

  try {
    if (nextWeekPlanId.value) {
      await mealPlanApiService.updateWeeklyMealPlan(nextWeekPlanId.value, payload)
    } else {
      const createdPlan = await mealPlanApiService.createWeeklyMealPlan(payload)
      nextWeekPlanId.value = getPlanId(createdPlan)
      nextWeekMealSlots.value = getPlanMeals(createdPlan)
    }

    statusMessage.value = t('planner.savedForNextWeek')
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.detail
        ?? error.response?.data?.message
        ?? (typeof error.response?.data === 'string' ? error.response.data : t('planner.saveError'))
  } finally {
    isSavingPlan.value = false
  }
}
</script>

<template>
  <div class="inicio-page">
    <PvHeader
        :selected-day="selectedDay"
        :meals-available="mealsAvailable"
        @day-selected="selectedDay = $event"
    />

    <section class="planner-status fh-container fh-container--narrow">
      <div class="planner-status__card" v-if="isLoadingPlan">
        <i class="pi pi-spin pi-spinner"></i>
        <span>{{ $t('planner.loadingPlan') }}</span>
      </div>
      <div class="planner-status__card" v-else>
        <div class="planner-status__top">
          <div class="planner-status__heading">
            <span class="planner-status__label">{{ progressLabel }}</span>
            <h3>{{ activeSelectedSlotsCount }} / {{ weeklySlotsLimit }} {{ slotsSelectedLabel }}</h3>
          </div>
          <span class="planner-status__plan">{{ subscriptionPlanName }}</span>
        </div>
        <div class="planner-status__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
          <span class="planner-status__bar-fill" :style="{ width: progressPercent + '%' }"></span>
        </div>
        <p class="planner-status__meta">
          {{ $t('planner.planLimit', { meals: subscriptionPlan.mealsPerDay }) }}
          <span v-if="selectedDayAppliesNextWeek">
            {{ $t('planner.nextWeekNotice') }}
          </span>
        </p>
      </div>

      <transition name="fh-fade">
        <p v-if="statusMessage" class="status-toast status-toast--success">
          {{ statusMessage }}
        </p>
      </transition>
      <transition name="fh-fade">
        <p v-if="errorMessage" class="status-toast status-toast--error">
          {{ errorMessage }}
        </p>
      </transition>
    </section>

    <PvDesayunos
        :selected-day="selectedDay"
        :selected-meal-id="selectedMealsByType[1]"
        :is-saving="isSavingPlan"
        :is-blocked="isMealTypeBlocked(1)"
        @meal-selected="handleMealSelected"
    />
    <PvAlmuerzos
        :selected-day="selectedDay"
        :selected-meal-id="selectedMealsByType[2]"
        :is-saving="isSavingPlan"
        :is-blocked="isMealTypeBlocked(2)"
        @meal-selected="handleMealSelected"
    />
    <PvCenas
        :selected-day="selectedDay"
        :selected-meal-id="selectedMealsByType[3]"
        :is-saving="isSavingPlan"
        :is-blocked="isMealTypeBlocked(3)"
        @meal-selected="handleMealSelected"
    />
  </div>
</template>

<style scoped>
.inicio-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-top: var(--space-6);
}

.planner-status {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.planner-status__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-xs);
}

.planner-status__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.planner-status__heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.planner-status__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-soft);
}

.planner-status__heading h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}

.planner-status__plan {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.planner-status__bar {
  position: relative;
  height: 10px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-alt);
  overflow: hidden;
}

.planner-status__bar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%);
  border-radius: var(--radius-pill);
  transition: width var(--duration-base) var(--ease-out);
}

.planner-status__meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

.planner-status__meta span {
  display: block;
  margin-top: 4px;
  color: var(--color-primary);
  font-weight: 600;
}

.status-toast {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
}

.status-toast--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.status-toast--error {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}
</style>
