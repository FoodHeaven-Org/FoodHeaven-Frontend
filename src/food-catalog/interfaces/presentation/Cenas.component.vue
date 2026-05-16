<script setup>
import CardCenasComponent from "@/food-catalog/interfaces/presentation/CardCenas.component.vue";
import { toComidaEntitiesFromResponse } from "@/food-catalog/application/internal/comida-resource.transform.js";
import {ComidasApiService} from "@/food-catalog/application/internal/comidas-api.service.js";
import {onBeforeMount, ref} from "vue";
const comidasApiService = new ComidasApiService();

const comidas = ref([])

onBeforeMount(async () => {
  comidas.value = toComidaEntitiesFromResponse(await comidasApiService.getDinnerMeals());

});

</script>

<template>
  <div class="contenedor-principal-cenas">
    <h2>{{ $t('title.cena') }}</h2>
    <hr>
    <div class="contenedor-cenas">
      <card-cenas-component v-for="comida in comidas"
                                :key="comida.id"
                                :comida="comida"/>
    </div>
  </div>
</template>

<style scoped>
.contenedor-cenas{
  display: grid;
  grid-template-columns:1fr 1fr 1fr 1fr;
  column-gap: 50px;
  row-gap: 30px;
}
.contenedor-principal-cenas{
  max-width: 1200px;
  margin: 40px auto 20px;

}
hr{
  margin-bottom: 30px;
}

@media (max-width: 680px) {
  .contenedor-cenas{
    grid-template-columns:1fr 1fr ;


  }
  .contenedor-principal-cenas {
    padding: 50px;
  }

}
</style>