<script setup>
import CardAlmuerzosComponent from '@/food-catalog/interfaces/presentation/CardAlmuerzos.component.vue'
import { toComidaEntitiesFromResponse } from '@/food-catalog/application/internal/comida-resource.transform.js'
import { ComidasApiService } from '@/food-catalog/application/internal/comidas-api.service.js'
import { onBeforeMount, ref } from 'vue'

const props = defineProps({
  selectedDay: { type: Number, required: true },
  selectedMealId: { type: Number, default: 0 },
  isSaving: { type: Boolean, default: false }
})

const emit = defineEmits(['meal-selected'])
const comidasApiService = new ComidasApiService()
const comidas = ref([])

onBeforeMount(async () => {
  comidas.value = toComidaEntitiesFromResponse(await comidasApiService.getLunchMeals())
})

function selectMeal(comida) {
  emit('meal-selected', { mealTypeId: 2, mealId: comida.id })
}
</script>

<template>
  <div class="contenedor-principal-almuerzos">
    <h2>{{ $t('title.almuerzo') }}</h2>
    <hr>
    <div class="contenedor-almuerzos">
      <card-almuerzos-component
          v-for="comida in comidas"
          :key="comida.id"
          :comida="comida"
          :selected="selectedMealId === comida.id"
          :is-saving="isSaving"
          @select="selectMeal"
      />
    </div>
  </div>
</template>

<style scoped>
.contenedor-almuerzos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 50px;
  row-gap: 30px;
}

.contenedor-principal-almuerzos {
  max-width: 1200px;
  margin: 40px auto 20px;
}

hr {
  margin-bottom: 30px;
}

@media (max-width: 900px) {
  .contenedor-almuerzos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contenedor-principal-almuerzos {
    padding: 0 20px;
  }
}
</style>
