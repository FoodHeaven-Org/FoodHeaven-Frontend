<script setup>
import PvHeader from '@/food-catalog/interfaces/presentation/Header.component.vue'
import PvDesayunos from '@/food-catalog/interfaces/presentation/Desayunos.component.vue'
import PvAlmuerzos from '@/food-catalog/interfaces/presentation/Almuerzos.component.vue'
import PvCenas from '@/food-catalog/interfaces/presentation/Cenas.component.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'
import { MealPlanApiService } from '@/meal-plans/application/internal/meal-plan-api.service.js'
import {
  createEmptyMealSlots,
  EMPTY_MEAL_SLOT,
  findPlanForWeek,
  getCurrentWeekRange,
  getMealSlotIndex,
  getPlanId,
  getPlanMeals,
  toBackendDate
} from '@/meal-plans/application/internal/weekly-plan.helpers.js'
import { getSubscriptionPlan } from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'

const { t } = useI18n()
const accountApiService = new AccountApiService()
const mealPlanApiService = new MealPlanApiService()
const { monday, nextMonday, todayIndex } = getCurrentWeekRange()

const selectedDay = ref(todayIndex)
const currentPlanId = ref(null)
const mealSlots = ref(createEmptyMealSlots())
const isLoadingPlan = ref(true)
const isSavingPlan = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const subscriptionPlan = ref(getSubscriptionPlan('Full'))

const selectedMealsByType = computed(() => ({
  1: mealSlots.value[getMealSlotIndex(1, selectedDay.value)],
  2: mealSlots.value[getMealSlotIndex(2, selectedDay.value)],
  3: mealSlots.value[getMealSlotIndex(3, selectedDay.value)]
}))

const selectedSlotsCount = computed(() => mealSlots.value.filter(mealId => mealId > 0).length)
const weeklySlotsLimit = computed(() => subscriptionPlan.value.mealsPerDay * 7)
const subscriptionPlanName = computed(() => t(subscriptionPlan.value.nameKey))

onBeforeMount(async () => {
  await loadCurrentWeekPlan()
})

async function loadCurrentWeekPlan() {
  isLoadingPlan.value = true
  errorMessage.value = ''

  try {
    const [plans, profile] = await Promise.all([
      mealPlanApiService.getCurrentUserMealPlans(),
      accountApiService.getCurrentProfile()
    ])
    subscriptionPlan.value = getSubscriptionPlan(profile.subscription)

    const currentPlan = findPlanForWeek(plans, monday, nextMonday)

    if (!currentPlan) return

    currentPlanId.value = getPlanId(currentPlan)
    mealSlots.value = getPlanMeals(currentPlan)
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

  const slotIndex = getMealSlotIndex(mealTypeId, selectedDay.value)
  const currentMealId = mealSlots.value[slotIndex]
  const nextMealId = currentMealId === mealId ? EMPTY_MEAL_SLOT : mealId

  if (nextMealId > 0 && currentMealId <= 0 && getSelectedMealsForDay(selectedDay.value) >= subscriptionPlan.value.mealsPerDay) {
    errorMessage.value = t('planner.limitReached', { meals: subscriptionPlan.value.mealsPerDay })
    return
  }

  const nextSlots = [...mealSlots.value]
  nextSlots[slotIndex] = nextMealId
  mealSlots.value = nextSlots

  await persistCurrentPlan()
}

function getSelectedMealsForDay(dayIndex) {
  return [1, 2, 3].filter(mealTypeId => mealSlots.value[getMealSlotIndex(mealTypeId, dayIndex)] > 0).length
}

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
</script>

<template>
  <PvHeader
      :selected-day="selectedDay"
      :meals-available="12"
      @day-selected="selectedDay = $event"
  />

  <div class="planner-status">
    <p v-if="isLoadingPlan">{{ $t('planner.loadingPlan') }}</p>
    <p v-else>
      {{ selectedSlotsCount }}/{{ weeklySlotsLimit }} {{ $t('planner.slotsSelected') }}
      - {{ subscriptionPlanName }} ({{ $t('planner.planLimit', { meals: subscriptionPlan.mealsPerDay }) }})
    </p>
    <p v-if="statusMessage" class="success-message">{{ statusMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>

  <PvDesayunos
      :selected-day="selectedDay"
      :selected-meal-id="selectedMealsByType[1]"
      :is-saving="isSavingPlan"
      @meal-selected="handleMealSelected"
  />
  <PvAlmuerzos
      :selected-day="selectedDay"
      :selected-meal-id="selectedMealsByType[2]"
      :is-saving="isSavingPlan"
      @meal-selected="handleMealSelected"
  />
  <PvCenas
      :selected-day="selectedDay"
      :selected-meal-id="selectedMealsByType[3]"
      :is-saving="isSavingPlan"
      @meal-selected="handleMealSelected"
  />
</template>

<style scoped>
.planner-status {
  max-width: 900px;
  margin: 24px auto 0;
  text-align: center;
  font-weight: 600;
}

.success-message {
  color: #2e7d32;
}

.error-message {
  color: #b42318;
}
</style>
