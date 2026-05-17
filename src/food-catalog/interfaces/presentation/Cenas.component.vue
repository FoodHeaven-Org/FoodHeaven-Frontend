<script setup>
import CardCenasComponent from '@/food-catalog/interfaces/presentation/CardCenas.component.vue'
import { toComidaEntitiesFromResponse } from '@/food-catalog/application/internal/comida-resource.transform.js'
import { ComidasApiService } from '@/food-catalog/application/internal/comidas-api.service.js'
import { onBeforeMount, ref } from 'vue'

const props = defineProps({
  selectedDay: { type: Number, required: true },
  selectedMealId: { type: Number, default: 0 },
  isSaving: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
})

const emit = defineEmits(['meal-selected'])
const comidasApiService = new ComidasApiService()
const comidas = ref([])
const isLoading = ref(true)

onBeforeMount(async () => {
  try {
    comidas.value = toComidaEntitiesFromResponse(await comidasApiService.getDinnerMeals())
  } finally {
    isLoading.value = false
  }
})

function selectMeal(comida) {
  emit('meal-selected', { mealTypeId: 3, mealId: comida.id })
}
</script>

<template>
  <section class="meal-section fh-container">
    <header class="meal-section__header">
      <h2 class="meal-section__title">{{ $t('title.cena') }}</h2>
      <span class="meal-section__count">{{ comidas.length }}</span>
    </header>

    <div v-if="isLoading" class="meal-section__grid">
      <div v-for="i in 4" :key="i" class="meal-skeleton">
        <div class="fh-skeleton meal-skeleton__media"></div>
        <div class="fh-skeleton meal-skeleton__line"></div>
        <div class="fh-skeleton meal-skeleton__line short"></div>
      </div>
    </div>

    <div v-else class="meal-section__grid">
      <card-cenas-component
          v-for="comida in comidas"
          :key="comida.id"
          :comida="comida"
          :selected="selectedMealId === comida.id"
          :is-blocked="isBlocked && selectedMealId !== comida.id"
          :is-saving="isSaving"
          @select="selectMeal"
      />
    </div>
  </section>
</template>

<style scoped>
.meal-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.meal-section__header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--color-divider);
}

.meal-section__title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.meal-section__count {
  padding: 3px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.82rem;
}

.meal-section__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: var(--space-5);
  align-items: stretch;
}

.meal-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.meal-skeleton__media {
  aspect-ratio: 4 / 3;
  width: 100%;
  border-radius: var(--radius-md);
}

.meal-skeleton__line { height: 14px; border-radius: var(--radius-pill); }
.meal-skeleton__line.short { width: 60%; }

@media (max-width: 1100px) {
  .meal-section__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 820px) {
  .meal-section__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 480px) {
  .meal-section__grid { grid-template-columns: 1fr; }
  .meal-section__title { font-size: 1.3rem; }
}
</style>
