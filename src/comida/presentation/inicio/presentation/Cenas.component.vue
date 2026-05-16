<script setup>
import CardCenasComponent from "@/comida/presentation/inicio/presentation/CardCenas.component.vue";
import {defineProps} from "vue";
import {ComidaAssembler} from "@/comida/presentation/inicio/application/comidaAssembler.js";
import {ComidasApiService} from "@/comida/presentation/inicio/application/comidas-api.service.js";
import {onBeforeMount, ref} from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const newsApiService = new ComidasApiService();

const comidas = ref([])

onBeforeMount(async () => {
  comidas.value = ComidaAssembler.toEntitiesFromResponse(await newsApiService.getArticles3());

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