<script setup>
import PvCuadro from '@/food-catalog/interfaces/presentation/Cuadro.component.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  selectedDay: { type: Number, required: true },
  mealsAvailable: { type: Number, default: 12 }
})
const emit = defineEmits(['day-selected'])

const dayLabels = computed(() => [
  t('cuadro.dia1'),
  t('cuadro.dia2'),
  t('cuadro.dia3'),
  t('cuadro.dia4'),
  t('cuadro.dia5'),
  t('cuadro.dia6'),
  t('cuadro.dia7')
])
</script>

<template>
  <h1>{{ $t('header.title') }}</h1>
  <p>{{ $t('header.paragraph1') }} <span>{{ $t('header.span') }}</span> {{ $t('header.paragraph2') }}</p>

  <div class="contenedor-header">
    <PvCuadro :count="mealsAvailable" />
  </div>

  <div class="contenedor-fechas">
    <Button
        v-for="(label, index) in dayLabels"
        :key="index"
        :label="label"
        class="contenedor_dia"
        :class="{ activo: props.selectedDay === index }"
        @click="emit('day-selected', index)"
    />
  </div>
</template>

<style scoped>
h1 {
  margin: 20px;
  text-align: center;
  font-size: 40px;
}

p {
  text-align: center;
  margin-bottom: 30px;
}

span {
  font-weight: bold;
}

.contenedor-header {
  display: flex;
  justify-content: center;
  min-height: 240px;
}

.contenedor-fechas {
  display: flex;
  max-width: 900px;
  margin: 0 auto;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.contenedor-fechas .contenedor_dia {
  text-decoration: none;
  color: black;
  border: 1px solid black;
  padding: 15px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: white;
}

.contenedor-fechas .contenedor_dia:hover {
  background-color: #45ce45;
  border-color: #45ce45;
  color: white;
}

.activo {
  background-color: #2ecc71 !important;
  color: white !important;
  font-weight: bold;
  border-color: #2ecc71 !important;
}

@media (max-width: 680px) {
  h1 {
    font-size: 32px;
  }

  .contenedor-fechas {
    justify-content: center;
    padding: 0 20px;
  }
}
</style>
