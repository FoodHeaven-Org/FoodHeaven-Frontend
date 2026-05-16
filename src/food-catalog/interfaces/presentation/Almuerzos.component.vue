<script setup>
import CardAlmuerzosComponent from "@/food-catalog/interfaces/presentation/CardAlmuerzos.component.vue";
import { toComidaEntitiesFromResponse } from "@/food-catalog/application/internal/comida-resource.transform.js";
import {ComidasApiService} from "@/food-catalog/application/internal/comidas-api.service.js";
import {onBeforeMount, ref} from "vue";

const comidasApiService = new ComidasApiService();

const comidas = ref([])

onBeforeMount(async () => {
  comidas.value = toComidaEntitiesFromResponse(await comidasApiService.getLunchMeals());

});


</script>

<template>
  <div class="contenedor-principal-almuerzos">
      <h2>{{ $t('title.almuerzo') }}</h2>
    <hr>
    <div class="contenedor-almuerzos">
      <card-almuerzos-component v-for="comida in comidas"
                                :key="comida.id"
                                :comida="comida"/>
    </div>
  </div>
</template>

<style scoped>
.contenedor-almuerzos{
  display: grid;
  grid-template-columns:1fr 1fr 1fr 1fr;
  column-gap: 50px;
  row-gap: 30px;
}
.contenedor-principal-almuerzos{
  max-width: 1200px;
  margin: 40px auto 20px;

}
hr{
  margin-bottom: 30px;
}

@media (max-width: 680px) {
  .contenedor-almuerzos{
    grid-template-columns:1fr 1fr ;


  }
  .contenedor-principal-almuerzos {
    padding: 50px;
  }

}
</style>