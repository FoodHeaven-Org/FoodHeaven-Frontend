<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { localizeMeal } from '@/food-catalog/domain/model/valueobjects/meal-translation.valueobject.js'

const { t, locale } = useI18n()
const emit = defineEmits(['select'])

const props = defineProps({
  comida: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false }
})

const displayedMeal = computed(() => localizeMeal(props.comida, locale.value))
</script>

<template>
  <Card class="custom-card" :class="{ selected }">
    <template #header>
      <img
          class="card-image"
          v-if="displayedMeal.url"
          :src="displayedMeal.url"
          :alt="displayedMeal.nombre"
      >

      <div class="contenedor-info">
        <p>Kcal: {{ displayedMeal.nutriente }} kcal</p>
        <p>Prote: {{ displayedMeal.prote }} g</p>
        <p>Carbo: {{ displayedMeal.carbo }} g</p>
        <p>Grasa: {{ displayedMeal.grasa }} g</p>
      </div>
    </template>

    <template #title>
      <h2 class="card-title">{{ displayedMeal.nombre }}</h2>
    </template>

    <template #subtitle>
      <p class="card-subtitle">{{ displayedMeal.complemento }}</p>
    </template>

    <template #footer>
      <Button
          class="select-button"
          :class="{ selected }"
          :disabled="isSaving"
          :label="selected ? t('planner.remove') : t('planner.choose')"
          @click="emit('select', comida)"
      />
    </template>
  </Card>
</template>

<style scoped>
.custom-card {
  max-width: 300px;
  min-height: 520px;
  margin: auto auto 30px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.custom-card.selected {
  border-color: #2ecc71;
}

.custom-card:hover {
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  display: block;
  background: #f2f2f2;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 8px 0 4px;
}

.card-subtitle {
  min-height: 42px;
  font-size: 14px;
  text-align: center;
  padding: 0 12px;
  color: #444;
  margin-bottom: 12px;
}

.contenedor-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 12px;
  padding: 12px;
  width: 80%;
  margin: 10px auto;
}

.select-button {
  display: block;
  width: calc(100% - 48px);
  margin: 0 auto 18px;
  background-color: white;
  color: black;
  border: 1px solid black;
  border-radius: 20px;
  font-weight: 700;
}

.select-button:hover,
.select-button.selected {
  background-color: #2ecc71;
  color: white;
  border-color: #2ecc71;
}
</style>
