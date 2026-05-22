export const EMPTY_MEAL_SLOT = 0
export const DAYS_IN_WEEK = 7
export const MEALS_PER_DAY = 3
export const WEEKLY_MEAL_SLOTS = DAYS_IN_WEEK * MEALS_PER_DAY

export function createEmptyMealSlots() {
    return Array.from({ length: WEEKLY_MEAL_SLOTS }, () => EMPTY_MEAL_SLOT)
}

export function getCurrentWeekRange(date = new Date()) {
    const today = new Date(date)
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
    const monday = new Date(today)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(today.getDate() - todayIndex)

    const nextMonday = new Date(monday)
    nextMonday.setDate(monday.getDate() + DAYS_IN_WEEK)

    return { monday, nextMonday, todayIndex }
}

export function getPlanId(plan) {
    return plan?.id ?? plan?.Id ?? null
}

export function getPlanMeals(plan) {
    const meals = plan?.listaComidas ?? plan?.ListaComidas ?? []
    const slots = createEmptyMealSlots()

    meals.slice(0, WEEKLY_MEAL_SLOTS).forEach((mealId, index) => {
        slots[index] = Number(mealId) || EMPTY_MEAL_SLOT
    })

    return slots
}

export function getMealSlotIndex(mealTypeId, dayIndex) {
    return ((mealTypeId - 1) * DAYS_IN_WEEK) + dayIndex
}

export function trimMealSlotsToDailyLimit(mealSlots, mealsPerDayLimit) {
    return trimMealSlotsToDailyLimitFromDay(mealSlots, mealsPerDayLimit, 0)
}

export function trimMealSlotsToDailyLimitFromDay(mealSlots, mealsPerDayLimit, firstDayIndex) {
    if (mealSlots.length !== WEEKLY_MEAL_SLOTS) return mealSlots

    const trimmedMealSlots = [...mealSlots]

    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
        if (dayIndex < firstDayIndex) continue

        let selectedMealsForDay = 0

        for (let mealTypeIndex = 0; mealTypeIndex < MEALS_PER_DAY; mealTypeIndex++) {
            const slotIndex = (mealTypeIndex * DAYS_IN_WEEK) + dayIndex
            if (trimmedMealSlots[slotIndex] <= EMPTY_MEAL_SLOT) continue

            selectedMealsForDay++
            if (selectedMealsForDay > mealsPerDayLimit) {
                trimmedMealSlots[slotIndex] = EMPTY_MEAL_SLOT
            }
        }
    }

    return trimmedMealSlots
}

export function areMealSlotsEqual(firstMealSlots, secondMealSlots) {
    if (firstMealSlots.length !== secondMealSlots.length) return false

    return firstMealSlots.every((mealId, index) => mealId === secondMealSlots[index])
}

export function findPlanForWeek(mealPlans, monday, nextMonday) {
    return mealPlans.find(plan => {
        const start = new Date(plan.fechaInicio ?? plan.FechaInicio)
        const end = new Date(plan.fechaFin ?? plan.FechaFin)
        return start < nextMonday && monday < end
    })
}

export function toBackendDate(date) {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
}
