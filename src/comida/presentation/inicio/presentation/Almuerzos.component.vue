<script setup>
import CardAlmuerzosComponent from "@/comida/presentation/inicio/presentation/CardAlmuerzos.component.vue";
import {defineProps} from "vue";
import {ComidaAssembler} from "@/comida/presentation/inicio/application/comidaAssembler.js";
import {ComidasApiService} from "@/comida/presentation/inicio/application/comidas-api.service.js";
import {onBeforeMount, ref} from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const newsApiService = new ComidasApiService();

const comidas = ref([])

onBeforeMount(async () => {
  comidas.value = ComidaAssembler.toEntitiesFromResponse(await newsApiService.getArticles2());

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