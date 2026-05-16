<script setup>
    import CardDesayunosComponent from "@/food-catalog/interfaces/presentation/CardDesayunos.component.vue";
    import { toComidaEntitiesFromResponse } from "@/food-catalog/application/internal/comida-resource.transform.js";
    import {ComidasApiService} from "@/food-catalog/application/internal/comidas-api.service.js";
    import {onBeforeMount, ref} from "vue";

    const comidasApiService = new ComidasApiService();

    const comidas = ref([])

    onBeforeMount(async () => {
      comidas.value = toComidaEntitiesFromResponse(await comidasApiService.getBreakfastMeals());

    });

</script>

      <template>
        <div class="contenedor-principal-desayunos">
          <h2>{{ $t('title.desayuno') }}</h2>
          <hr>
          <div class="contenedor-desayunos">

            <card-desayunos-component v-for="comida in comidas"
                                      :key="comida.id"
                                      :comida="comida"/>
          </div>
        </div>
      </template>

<style scoped>
.contenedor-desayunos{
  display: grid;
  grid-template-columns:1fr 1fr 1fr 1fr;
  column-gap: 50px;


}
.contenedor-principal-desayunos{
  max-width: 1200px;
  margin: 40px auto 0;

}
hr{
  margin-bottom: 30px;
}

@media (max-width: 680px) {
  .contenedor-desayunos{
    grid-template-columns:1fr 1fr ;
    row-gap: 30px;

  }
  .contenedor-principal-desayunos {
    padding: 50px;
  }
}
</style>