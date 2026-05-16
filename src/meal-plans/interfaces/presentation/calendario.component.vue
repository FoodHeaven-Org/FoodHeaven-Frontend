<script setup>
import { useI18n } from 'vue-i18n'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { MealPlanApiService } from '@/meal-plans/application/internal/meal-plan-api.service.js'
import { ComidasApiService } from '@/food-catalog/application/internal/comidas-api.service.js'
import { toComidaEntitiesFromResponse } from '@/food-catalog/application/internal/comida-resource.transform.js'
import {
  findPlanForWeek,
  getCurrentWeekRange,
  getPlanMeals
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

const comidas = computed(() => [
  t('calendar.breakfast'),
  t('calendar.lunch'),
  t('calendar.dinner')
])

const { monday, nextMonday, todayIndex } = getCurrentWeekRange()
const mesActual = new Date().toLocaleString('es-ES', { month: 'short' }).replace('.', '')
const mesFormateado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1) + '.'

const fechasSemana = ref([])
for (let i = 0; i < 7; i++) {
  const fecha = new Date(monday)
  fecha.setDate(monday.getDate() + i)
  fechasSemana.value.push({
    dia: dias.value[i],
    numero: fecha.getDate(),
    esHoy: i === todayIndex
  })
}

watch(() => locale.value, () => {
  fechasSemana.value.forEach((fecha, i) => {
    fecha.dia = dias.value[i]
  })
})

const emptyMeal = { nombre: '-', descripcion: '', calorias: 0 }
const datosComida = ref(createEmptyWeek())
const isLoading = ref(true)
const errorMessage = ref('')
const hasActivePlan = ref(false)

onBeforeMount(async () => {
  try {
    const [mealPlans, mealsResponse] = await Promise.all([
      mealPlanApiService.getCurrentUserMealPlans(),
      comidasApiService.getAllMeals()
    ])

    const meals = toComidaEntitiesFromResponse(mealsResponse)
    const mealById = new Map(meals.map(meal => [meal.id, meal]))
    const activePlan = findPlanForWeek(mealPlans, monday, nextMonday)

    if (!activePlan) {
      hasActivePlan.value = false
      return
    }

    hasActivePlan.value = true
    datosComida.value = buildCalendarMeals(getPlanMeals(activePlan), mealById)
  } catch (error) {
    console.error(error)
    errorMessage.value = t('calendar.loadError')
  } finally {
    isLoading.value = false
  }
})

const caloriasPorDia = computed(() =>
    fechasSemana.value.map((_, diaIndex) =>
        datosComida.value.reduce((total, comida) => total + (comida[diaIndex]?.calorias || 0), 0)
    )
)

const caloriasSemana = computed(() =>
    caloriasPorDia.value.reduce((total, calorias) => total + calorias, 0)
)

function createEmptyWeek() {
  return [
    Array.from({ length: 7 }, () => ({ ...emptyMeal })),
    Array.from({ length: 7 }, () => ({ ...emptyMeal })),
    Array.from({ length: 7 }, () => ({ ...emptyMeal }))
  ]
}

function buildCalendarMeals(mealIds, mealById) {
  const calendarMeals = createEmptyWeek()

  for (let mealTypeIndex = 0; mealTypeIndex < 3; mealTypeIndex++) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const mealId = mealIds[(mealTypeIndex * 7) + dayIndex]
      const meal = mealById.get(mealId)

      if (!meal) continue

      calendarMeals[mealTypeIndex][dayIndex] = {
        nombre: meal.nombre,
        descripcion: meal.complemento,
        calorias: meal.nutriente
      }
    }
  }

  return calendarMeals
}
</script>

<template>
  <div class="p-4">
    <p v-if="isLoading" class="status-message">{{ t('calendar.loading') }}</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div v-else-if="!hasActivePlan" class="empty-state">
      <p class="status-message">{{ t('calendar.noPlan') }}</p>
      <RouterLink class="home-link" :to="{ name: 'Inicio' }">{{ $t('calendar.goHome') }}</RouterLink>
    </div>

    <table v-else>
      <thead class="table-header">
      <tr>
        <th><h1>{{ mesFormateado }}</h1></th>
        <th v-for="(fecha, i) in fechasSemana" :key="i">
          <h2 class="day-table">
            {{ fecha.dia }}
            <p :class="fecha.esHoy ? 'highlight-day-circle' : ''">
              {{ fecha.numero }}
            </p>
          </h2>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(comida, i) in comidas" :key="i">
        <td><h2>{{ comida }}</h2></td>
        <td
            v-for="(fecha, j) in fechasSemana"
            :key="j"
            :class="fecha.esHoy ? 'highlight-day' : ''"
        >
          <h3>{{ datosComida[i][j].nombre }}</h3>
          <p>{{ datosComida[i][j].descripcion }}</p>
        </td>
      </tr>
      <tr class="calories-table">
        <td class="empty-space"></td>
        <td
            v-for="(fecha, j) in fechasSemana"
            :key="j"
            :class="fecha.esHoy ? 'highlight-day' : ''"
        >
          <h3>{{ t('calendar.totalCalories') }}</h3>
          <p>{{ caloriasPorDia[j] }} kcal</p>
        </td>
      </tr>
      </tbody>
      <tfoot class="table-footer">
      <tr>
        <td class="empty-space"></td>
        <td colspan="7">
          <h3>{{ t('calendar.totalWeekCalories') }}</h3>
          <p>{{ caloriasSemana }} kcal</p>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
h2,h3,p{
  text-align: center;
  margin: auto 0;
}

table{
  border-collapse: collapse;
  margin: 20px auto;
}

th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 32px 12px;
}

h2{
  font-weight: normal;
}

h3{
  line-height: 28px;
}

.day-table{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.p-4{
  color: black;
}

.calories-table td, .calories-table th, .calories-table p, .calories-table h3{
  padding: 0 4px;
  margin: 4px;
}

.table-footer td, .table-footer th, .table-footer p, .table-footer h3{
  padding: 1px;
  margin: 4px;
}

.table-header td, .table-header th, .table-header p, .table-header h2{
  padding: 1px;
  margin: 1px;
}

td.empty-space {
  border: none;
  background: transparent;
  padding: 0;
}

.highlight-day-circle {
  background-color: #53C758;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.highlight-day {
  color: #53C758;
}

.status-message,
.error-message {
  margin: 2rem auto;
  text-align: center;
  font-weight: 600;
}

.error-message {
  color: #b42318;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.home-link {
  border: 1px solid #2e7d32;
  border-radius: 10px;
  color: #2e7d32;
  font-weight: 700;
  padding: 10px 20px;
  text-decoration: none;
}

.home-link:hover {
  background: #2e7d32;
  color: white;
}
</style>
