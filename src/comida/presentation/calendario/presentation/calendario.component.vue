<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'

const { t, locale } = useI18n()

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

const today = new Date()
const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

const monday = new Date(today)
monday.setDate(today.getDate() - todayIndex)

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

// Actualizar los días cuando cambie el idioma
watch(() => locale.value, () => {
  fechasSemana.value.forEach((fecha, i) => {
    fecha.dia = dias.value[i]
  })
})


// Datos de comidas: vacío por ahora
const datosComida = ref([
  // desayuno, almuerzo, cena para 7 días
  Array.from({ length: 7 }, () => ({ nombre: '', descripcion: '', calorias: 0 })),
  Array.from({ length: 7 }, () => ({ nombre: '', descripcion: '', calorias: 0 })),
  Array.from({ length: 7 }, () => ({ nombre: '', descripcion: '', calorias: 0 }))
])

// Datos de ejemplo
datosComida.value[1][3] = {
  nombre: 'Ejemplo',
  descripcion: 'Descripción de ejemplo',
  calorias: 450
}

// === Calorías por día ===
const caloriasPorDia = computed(() =>
    fechasSemana.value.map((_, diaIndex) =>
        datosComida.value.reduce((total, comida) => total + (comida[diaIndex]?.calorias || 0), 0)
    )
)

// === Calorías total de la semana ===
const caloriasSemana = computed(() =>
    caloriasPorDia.value.reduce((total, calorias) => total + calorias, 0)
)
</script>

<template>
  <div class="p-4">
    <table>
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
          <!-- Aquí irá la comida cuando se tenga data -->
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
</style>