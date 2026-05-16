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
