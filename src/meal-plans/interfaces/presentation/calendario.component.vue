<script setup>
import { useI18n } from 'vue-i18n'
import { computed, onBeforeMount, ref } from 'vue'
import { MealPlanApiService } from '@/meal-plans/application/internal/meal-plan-api.service.js'
import { ComidasApiService } from '@/food-catalog/application/internal/comidas-api.service.js'
import { toComidaEntitiesFromResponse } from '@/food-catalog/application/internal/comida-resource.transform.js'
import {
  createDefaultDeliverySchedules,
  createEmptyMealSlots,
  DAYS_IN_WEEK,
  findPlanForWeek,
  getCurrentWeekRange,
  getMealSlotIndex,
  getPlanDeliverySchedules,
  getPlanId,
  getPlanMeals,
  toBackendDate
} from '@/meal-plans/application/internal/weekly-plan.helpers.js'

const { t, locale } = useI18n()
const mealPlanApiService = new MealPlanApiService()
const comidasApiService = new ComidasApiService()

const dias = computed(() => [
  t('calendar.monday'),
  t('calendar.tuesday'),
  t('calendar.wednesday'),
  t('calendar.thursday'),
  t('calendar.friday'),
  t('calendar.saturday'),
  t('calendar.sunday')
])

const mealTypeLabels = computed(() => [
  t('calendar.breakfast'),
  t('calendar.lunch'),
  t('calendar.dinner')
])

/* ------------------------------------------------------------------ *
 * Week ranges: this week and next week. Selections made in Home for
 * days that already passed are stored on the NEXT week's plan, so the
 * calendar can now switch between both weeks to show them.
 * ------------------------------------------------------------------ */
const { monday, nextMonday, todayIndex } = getCurrentWeekRange()
const nextWeekMonday = new Date(nextMonday)
const followingMonday = new Date(nextWeekMonday)
followingMonday.setDate(nextWeekMonday.getDate() + DAYS_IN_WEEK)

const WEEK = { CURRENT: 'current', NEXT: 'next' }
const selectedWeek = ref(WEEK.CURRENT)

const weekRanges = {
  current: { start: monday, end: nextMonday },
  next: { start: nextWeekMonday, end: followingMonday }
}

function emptyWeekState() {
  return {
    planId: null,
    mealIds: createEmptyMealSlots(),
    schedules: createDefaultDeliverySchedules(),
    hasPlan: false
  }
}

const weekState = ref({
  current: emptyWeekState(),
  next: emptyWeekState()
})

const activeWeek = computed(() => weekState.value[selectedWeek.value])
const activeMonday = computed(() => weekRanges[selectedWeek.value].start)

const mealById = ref(new Map())
const isLoading = ref(true)
const isSavingSchedule = ref(false)
const errorMessage = ref('')
const scheduleStatusMessage = ref('')
const scheduleErrorMessage = ref('')

const monthFormatter = computed(() => new Intl.DateTimeFormat(locale.value === 'es' ? 'es-ES' : 'en-US', {
  month: 'long',
  year: 'numeric'
}))

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value === 'es' ? 'es-ES' : 'en-US', {
  day: 'numeric',
  month: 'long'
}))

const monthLabel = computed(() => {
  const text = monthFormatter.value.format(activeMonday.value)
  return text.charAt(0).toUpperCase() + text.slice(1)
})

const weekRangeLabel = computed(() => t('calendar.planForWeekOf', {
  date: dateFormatter.value.format(activeMonday.value)
}))

const fechasSemana = computed(() => {
  const baseMonday = weekRanges[selectedWeek.value].start
  const isCurrent = selectedWeek.value === WEEK.CURRENT
  const out = []

  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const fecha = new Date(baseMonday)
    fecha.setDate(baseMonday.getDate() + i)
    out.push({
      dia: dias.value[i],
      numero: fecha.getDate(),
      esHoy: isCurrent && i === todayIndex,
      // Days that need 1-day notice (current week, up to & including today).
      // Next week is fully in the future, so nothing is locked there.
      protegido: isCurrent && i <= todayIndex
    })
  }

  return out
})

const hasActivePlan = computed(() => activeWeek.value.hasPlan)

onBeforeMount(async () => {
  try {
    const [mealPlans, mealsResponse] = await Promise.all([
      mealPlanApiService.getCurrentUserMealPlans(),
      comidasApiService.getAllMeals()
    ])

    const meals = toComidaEntitiesFromResponse(mealsResponse)
    mealById.value = new Map(meals.map(meal => [meal.id, meal]))

    const currentPlan = findPlanForWeek(mealPlans, monday, nextMonday)
    const nextPlan = findPlanForWeek(mealPlans, nextWeekMonday, followingMonday)

    weekState.value = {
      current: planToWeekState(currentPlan),
      next: planToWeekState(nextPlan)
    }

    // Open on whichever week actually has a plan, preferring the current one.
    if (!weekState.value.current.hasPlan && weekState.value.next.hasPlan) {
      selectedWeek.value = WEEK.NEXT
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = t('calendar.loadError')
  } finally {
    isLoading.value = false
  }
})

function planToWeekState(plan) {
  if (!plan) return emptyWeekState()

  return {
    planId: getPlanId(plan),
    mealIds: getPlanMeals(plan),
    schedules: getPlanDeliverySchedules(plan),
    hasPlan: true
  }
}

function selectWeek(week) {
  if (selectedWeek.value === week) return
  selectedWeek.value = week
  scheduleStatusMessage.value = ''
  scheduleErrorMessage.value = ''
}

/* ----------------------------- Meals ----------------------------- */
const emptyMeal = { nombre: '', descripcion: '', calorias: 0, horarioEntrega: '' }

function createEmptyWeek() {
  return [
    Array.from({ length: DAYS_IN_WEEK }, () => ({ ...emptyMeal })),
    Array.from({ length: DAYS_IN_WEEK }, () => ({ ...emptyMeal })),
    Array.from({ length: DAYS_IN_WEEK }, () => ({ ...emptyMeal }))
  ]
}

const datosComida = computed(() => buildCalendarMeals(
    activeWeek.value.mealIds,
    activeWeek.value.schedules,
    mealById.value,
    locale.value
))

function buildCalendarMeals(mealIds, deliverySchedules, mealMap, currentLocale) {
  const calendarMeals = createEmptyWeek()

  for (let mealTypeIndex = 0; mealTypeIndex < 3; mealTypeIndex++) {
    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
      const mealId = mealIds[(mealTypeIndex * DAYS_IN_WEEK) + dayIndex]
      const meal = mealMap.get(mealId)

      if (!meal) continue
      const localizedMeal = meal.getLocalized(currentLocale)

      calendarMeals[mealTypeIndex][dayIndex] = {
        nombre: localizedMeal.nombre,
        descripcion: localizedMeal.complemento,
        calorias: localizedMeal.nutriente,
        horarioEntrega: deliverySchedules[(mealTypeIndex * DAYS_IN_WEEK) + dayIndex]
      }
    }
  }

  return calendarMeals
}

const caloriasPorDia = computed(() =>
    fechasSemana.value.map((_, diaIndex) =>
        datosComida.value.reduce((total, comida) => total + (comida[diaIndex]?.calorias || 0), 0)
    )
)

const caloriasSemana = computed(() =>
    caloriasPorDia.value.reduce((total, calorias) => total + calorias, 0)
)

/* ------------------------- Delivery schedule ------------------------- */
const defaultDeliverySchedules = createDefaultDeliverySchedules()

function getDeliveryWindowForMealType(mealTypeIndex) {
  return mealTypeIndex === 0
      ? { min: '05:00', max: '12:00' }
      : { min: '12:00', max: '23:00' }
}

function getDeliveryScheduleParts(slotIndex) {
  const fallback = defaultDeliverySchedules[slotIndex]
  const schedule = activeWeek.value.schedules[slotIndex] || fallback
  const [start = '', end = ''] = schedule.split('-')
  return { start, end }
}

function getDeliveryStart(slotIndex) {
  return getDeliveryScheduleParts(slotIndex).start
}

function getDeliveryEnd(slotIndex) {
  return getDeliveryScheduleParts(slotIndex).end
}

function setActiveSchedules(nextSchedules) {
  weekState.value = {
    ...weekState.value,
    [selectedWeek.value]: {
      ...weekState.value[selectedWeek.value],
      schedules: nextSchedules
    }
  }
}

function updateDeliverySchedule(slotIndex, segment, value) {
  scheduleStatusMessage.value = ''
  scheduleErrorMessage.value = ''

  const parts = getDeliveryScheduleParts(slotIndex)
  const nextStart = segment === 'start' ? value : parts.start
  const nextEnd = segment === 'end' ? value : parts.end
  const nextSchedules = [...activeWeek.value.schedules]
  nextSchedules[slotIndex] = `${nextStart}-${nextEnd}`
  setActiveSchedules(nextSchedules)

  if (!isValidDeliverySchedule(slotIndex)) {
    scheduleErrorMessage.value = getDeliveryScheduleError(slotIndex)
  }
}

function applyDeliveryScheduleToWeek(mealTypeIndex, dayIndex) {
  const sourceSlotIndex = getMealSlotIndex(mealTypeIndex + 1, dayIndex)

  if (!isValidDeliverySchedule(sourceSlotIndex)) {
    scheduleErrorMessage.value = getDeliveryScheduleError(sourceSlotIndex)
    return
  }

  const nextSchedules = [...activeWeek.value.schedules]
  const deliverySchedule = nextSchedules[sourceSlotIndex]

  for (let currentDayIndex = 0; currentDayIndex < DAYS_IN_WEEK; currentDayIndex++) {
    if (fechasSemana.value[currentDayIndex]?.protegido) continue

    const targetSlotIndex = getMealSlotIndex(mealTypeIndex + 1, currentDayIndex)
    if (activeWeek.value.mealIds[targetSlotIndex] <= 0) continue

    nextSchedules[targetSlotIndex] = deliverySchedule
  }

  setActiveSchedules(nextSchedules)
  scheduleErrorMessage.value = ''
  scheduleStatusMessage.value = t('calendar.deliveryScheduleApplied', {
    meal: mealTypeLabels.value[mealTypeIndex].toLowerCase()
  })
}

function isValidDeliverySchedule(slotIndex) {
  return !getDeliveryScheduleError(slotIndex)
}

function getDeliveryScheduleError(slotIndex) {
  const mealTypeIndex = Math.floor(slotIndex / DAYS_IN_WEEK)
  const { min, max } = getDeliveryWindowForMealType(mealTypeIndex)
  const { start, end } = getDeliveryScheduleParts(slotIndex)
  const startMinutes = toMinutes(start)
  const endMinutes = toMinutes(end)
  const minMinutes = toMinutes(min)
  const maxMinutes = toMinutes(max)

  if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
    return t('calendar.deliveryScheduleRequired')
  }

  if (startMinutes >= endMinutes) {
    return t('calendar.deliveryScheduleOrderError')
  }

  if (startMinutes < minMinutes || endMinutes > maxMinutes) {
    return t('calendar.deliveryScheduleRangeError', { min, max })
  }

  return ''
}

function toMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number)
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return Number.NaN
  return (hours * 60) + minutes
}

async function saveDeliverySchedules() {
  scheduleStatusMessage.value = ''
  scheduleErrorMessage.value = ''

  const week = activeWeek.value

  if (!week.planId) {
    scheduleErrorMessage.value = t('calendar.noPlan')
    throw new Error(scheduleErrorMessage.value)
  }

  for (let slotIndex = 0; slotIndex < week.mealIds.length; slotIndex++) {
    if (week.mealIds[slotIndex] <= 0) continue

    const error = getDeliveryScheduleError(slotIndex)
    if (error) {
      scheduleErrorMessage.value = error
      throw new Error(error)
    }
  }

  isSavingSchedule.value = true

  try {
    const range = weekRanges[selectedWeek.value]
    await mealPlanApiService.updateWeeklyMealPlan(week.planId, {
      fechaInicio: toBackendDate(range.start),
      fechaFin: toBackendDate(range.end),
      listaComidas: week.mealIds,
      horariosEntrega: week.schedules
    })
    scheduleStatusMessage.value = t('calendar.deliveryScheduleSaved')
  } finally {
    isSavingSchedule.value = false
  }
}

defineExpose({
  saveDeliverySchedules
})
</script>

<template>
  <div class="calendar-board fh-container">
    <div v-if="isLoading" class="calendar-board__loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>{{ t('calendar.loading') }}</span>
    </div>

    <p v-else-if="errorMessage" class="calendar-board__error">
      {{ errorMessage }}
    </p>

    <template v-else>
      <!-- Week switcher + delivery-window legend -->
      <div class="calendar-toolbar">
        <div class="calendar-weeks" role="tablist" :aria-label="t('calendar.title')">
          <button
              type="button"
              role="tab"
              class="calendar-weeks__btn"
              :class="{ active: selectedWeek === WEEK.CURRENT }"
              :aria-selected="selectedWeek === WEEK.CURRENT"
              @click="selectWeek(WEEK.CURRENT)"
          >
            {{ t('calendar.thisWeek') }}
          </button>
          <button
              type="button"
              role="tab"
              class="calendar-weeks__btn"
              :class="{ active: selectedWeek === WEEK.NEXT }"
              :aria-selected="selectedWeek === WEEK.NEXT"
              @click="selectWeek(WEEK.NEXT)"
          >
            {{ t('calendar.nextWeek') }}
          </button>
        </div>

        <div class="calendar-legend" :title="t('calendar.deliveryWindowLegend')">
          <i class="pi pi-clock"></i>
          <span>{{ t('calendar.breakfastWindowLegend') }}</span>
          <span class="calendar-legend__dot">•</span>
          <span>{{ t('calendar.mealsWindowLegend') }}</span>
        </div>
      </div>

      <p class="calendar-board__week-range">{{ weekRangeLabel }}</p>

      <!-- Empty state for the selected week -->
      <div v-if="!hasActivePlan" class="calendar-empty fh-card">
        <i class="pi pi-calendar-times calendar-empty__icon"></i>
        <h2>{{ selectedWeek === WEEK.NEXT ? t('calendar.nextWeekEmpty') : t('calendar.currentWeekEmpty') }}</h2>
        <p v-if="selectedWeek === WEEK.NEXT" class="calendar-empty__hint">{{ t('calendar.nextWeekEmptyHint') }}</p>
        <RouterLink class="fh-btn fh-btn--primary" :to="{ name: 'Inicio' }">
          {{ t('calendar.goHome') }}
        </RouterLink>
      </div>

      <div v-else class="calendar-board__inner">
        <div class="calendar-grid">
          <div class="calendar-grid__row calendar-grid__row--head">
            <div class="calendar-grid__cell calendar-grid__cell--corner">
              <span>{{ monthLabel }}</span>
            </div>
            <div
                v-for="(fecha, i) in fechasSemana"
                :key="i"
                class="calendar-grid__cell calendar-grid__head"
                :class="{ today: fecha.esHoy }"
            >
              <span class="calendar-grid__day-label">{{ fecha.dia }}</span>
              <span class="calendar-grid__day-number" :class="{ today: fecha.esHoy }">{{ fecha.numero }}</span>
            </div>
          </div>

          <div
              v-for="(mealType, i) in mealTypeLabels"
              :key="i"
              class="calendar-grid__row"
          >
            <div class="calendar-grid__cell calendar-grid__cell--label">
              <h3>{{ mealType }}</h3>
            </div>
            <div
                v-for="(fecha, j) in fechasSemana"
                :key="j"
                class="calendar-grid__cell calendar-grid__meal"
                :class="{ today: fecha.esHoy, empty: !datosComida[i][j].nombre }"
            >
              <template v-if="datosComida[i][j].nombre">
                <p class="calendar-grid__meal-name">{{ datosComida[i][j].nombre }}</p>
                <p class="calendar-grid__meal-desc">{{ datosComida[i][j].descripcion }}</p>
                <span class="calendar-grid__meal-cal">{{ datosComida[i][j].calorias }} kcal</span>
                <div class="calendar-grid__delivery" :class="{ locked: fecha.protegido }">
                  <span class="calendar-grid__delivery-label">{{ t('calendar.deliveryWindow') }}</span>
                  <div class="calendar-grid__delivery-inputs">
                    <input
                        type="time"
                        :value="getDeliveryStart(getMealSlotIndex(i + 1, j))"
                        :min="getDeliveryWindowForMealType(i).min"
                        :max="getDeliveryWindowForMealType(i).max"
                        :disabled="fecha.protegido || isSavingSchedule"
                        :aria-label="t('calendar.deliveryStart')"
                        @input="updateDeliverySchedule(getMealSlotIndex(i + 1, j), 'start', $event.target.value)"
                    />
                    <span>-</span>
                    <input
                        type="time"
                        :value="getDeliveryEnd(getMealSlotIndex(i + 1, j))"
                        :min="getDeliveryWindowForMealType(i).min"
                        :max="getDeliveryWindowForMealType(i).max"
                        :disabled="fecha.protegido || isSavingSchedule"
                        :aria-label="t('calendar.deliveryEnd')"
                        @input="updateDeliverySchedule(getMealSlotIndex(i + 1, j), 'end', $event.target.value)"
                    />
                  </div>
                  <span class="calendar-grid__delivery-hint">
                    {{ t('calendar.deliveryAllowed', getDeliveryWindowForMealType(i)) }}
                  </span>
                  <button
                      class="calendar-grid__delivery-apply"
                      type="button"
                      :disabled="fecha.protegido || isSavingSchedule || !isValidDeliverySchedule(getMealSlotIndex(i + 1, j))"
                      @click="applyDeliveryScheduleToWeek(i, j)"
                  >
                    {{ t('calendar.applyScheduleToWeek') }}
                  </button>
                  <small v-if="fecha.protegido">{{ t('calendar.deliveryProtected') }}</small>
                </div>
              </template>
              <span v-else class="calendar-grid__meal-empty">—</span>
            </div>
          </div>

          <div class="calendar-grid__row calendar-grid__row--total">
            <div class="calendar-grid__cell calendar-grid__cell--label">
              <h3>{{ t('calendar.totalCalories') }}</h3>
            </div>
            <div
                v-for="(fecha, j) in fechasSemana"
                :key="j"
                class="calendar-grid__cell calendar-grid__total"
                :class="{ today: fecha.esHoy }"
            >
              <strong>{{ caloriasPorDia[j] }}</strong>
              <span>kcal</span>
            </div>
          </div>
        </div>

        <div class="calendar-board__weekly-total">
          <span class="label">{{ t('calendar.totalWeekCalories') }}</span>
          <strong>{{ caloriasSemana }} <em>kcal</em></strong>
        </div>

        <transition name="fh-fade">
          <p v-if="scheduleStatusMessage" class="calendar-board__toast calendar-board__toast--success">
            {{ scheduleStatusMessage }}
          </p>
        </transition>
        <transition name="fh-fade">
          <p v-if="scheduleErrorMessage" class="calendar-board__toast calendar-board__toast--error">
            {{ scheduleErrorMessage }}
          </p>
        </transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.calendar-board {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: min(1500px, calc(100vw - 32px));
  max-width: none;
  padding-inline: 0;
}

.calendar-board__loading,
.calendar-board__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px;
  font-weight: 600;
  font-size: 1rem;
}

.calendar-board__error {
  color: var(--color-danger);
}

/* Toolbar: week toggle + legend */
.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.calendar-weeks {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
}

.calendar-weeks__btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  padding: 9px 22px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.calendar-weeks__btn:hover {
  color: var(--color-text);
}

.calendar-weeks__btn.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-xs);
}

.calendar-legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 600;
}

.calendar-legend i {
  font-size: 0.9rem;
}

.calendar-legend__dot {
  opacity: 0.5;
}

.calendar-board__week-range {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

.calendar-empty {
  margin: 10px auto 0;
  padding: 40px 28px;
  max-width: 520px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.calendar-empty__icon {
  font-size: 2.4rem;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.calendar-empty h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.calendar-empty__hint {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 380px;
}

.calendar-board__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.calendar-board__weekly-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 22px 28px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-strong) 100%);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-brand);
}

.calendar-board__weekly-total .label {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  opacity: 0.9;
}

.calendar-board__weekly-total strong {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.calendar-board__weekly-total em {
  font-style: normal;
  font-size: 1rem;
  opacity: 0.9;
  margin-left: 4px;
}

.calendar-board__toast {
  align-self: center;
  margin: 0;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
}

.calendar-board__toast--success {
  color: var(--color-success);
  background: var(--color-success-soft);
}

.calendar-board__toast--error {
  color: var(--color-danger);
  background: var(--color-danger-soft);
}

/* Grid */
.calendar-grid {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.calendar-grid__row {
  display: grid;
  grid-template-columns: 160px repeat(7, minmax(155px, 1fr));
  border-bottom: 1px solid var(--color-divider);
}

.calendar-grid__row:last-child {
  border-bottom: none;
}

.calendar-grid__row--head,
.calendar-grid__row--total {
  background: var(--color-surface-2);
}

.calendar-grid__cell {
  padding: 16px 14px;
  border-right: 1px solid var(--color-divider);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 110px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.calendar-grid__cell:last-child {
  border-right: none;
}

.calendar-grid__cell--corner {
  background: var(--color-surface-2);
  min-height: 80px;
  padding: 14px 16px;
  align-items: center;
  text-align: center;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.35;
}

.calendar-grid__head {
  gap: 4px;
  padding: 14px 12px;
  min-height: 80px;
}

.calendar-grid__day-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.calendar-grid__day-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
}

.calendar-grid__day-number.today {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-brand);
}

.calendar-grid__head.today {
  background: var(--color-primary-soft);
}

.calendar-grid__cell--label {
  background: var(--color-surface-2);
  justify-content: center;
  padding: 14px 18px;
  text-align: center;
  align-items: center;
  gap: 4px;
}

.calendar-grid__cell--label h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.calendar-grid__meal {
  align-items: stretch;
  text-align: center;
  gap: 8px;
  justify-content: flex-start;
  padding: 18px 16px 16px;
}

.calendar-grid__meal.today {
  background: color-mix(in srgb, var(--color-primary-soft) 60%, transparent);
}

.calendar-grid__meal-name {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.25;
}

.calendar-grid__meal-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;
  hyphens: auto;
}

.calendar-grid__meal-cal {
  margin-top: auto;
  display: inline-flex;
  align-self: center;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: 0.7rem;
  font-weight: 600;
}

.calendar-grid__delivery {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-divider);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.calendar-grid__delivery-label {
  color: var(--color-text-soft);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.calendar-grid__delivery-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.calendar-grid__delivery-inputs input {
  width: 86px;
  min-width: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.76rem;
  padding: 5px 4px;
  text-align: center;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.calendar-grid__delivery-inputs input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.calendar-grid__delivery-inputs input:disabled {
  opacity: 0.58;
}

.calendar-grid__delivery-hint {
  color: var(--color-text-soft);
  font-size: 0.66rem;
  font-weight: 600;
}

.calendar-grid__delivery-apply {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 6px 10px;
  transition:
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
}

.calendar-grid__delivery-apply:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  transform: translateY(-1px);
}

.calendar-grid__delivery-apply:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.calendar-grid__delivery small {
  color: var(--color-text-soft);
  font-size: 0.68rem;
  line-height: 1.25;
}

.calendar-grid__delivery.locked {
  opacity: 0.75;
}

.calendar-grid__meal-empty {
  color: var(--color-text-soft);
  font-size: 1.4rem;
}

.calendar-grid__meal.empty {
  background: repeating-linear-gradient(
      135deg,
      transparent 0,
      transparent 8px,
      var(--color-surface-2) 8px,
      var(--color-surface-2) 9px
  );
  opacity: 0.55;
}

.calendar-grid__total {
  gap: 0;
}

.calendar-grid__total strong {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
}

.calendar-grid__total span {
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.calendar-grid__total.today {
  background: var(--color-primary-soft);
}

@media (max-width: 1100px) {
  /* As the cells get narrower we let the user scroll horizontally
     instead of hiding the description (which the user wants visible). */
  .calendar-board {
    width: 100%;
    padding-inline: var(--space-5);
  }

  .calendar-board__inner {
    overflow-x: auto;
    padding-bottom: 6px;
  }

  .calendar-grid {
    min-width: 1130px;
  }
}

@media (max-width: 600px) {
  .calendar-grid {
    min-width: 1100px;
  }

  .calendar-grid__meal-name {
    font-size: 0.86rem;
  }

  .calendar-board__weekly-total {
    align-items: flex-start;
    flex-direction: column;
  }

  .calendar-toolbar {
    justify-content: center;
  }
}
</style>
