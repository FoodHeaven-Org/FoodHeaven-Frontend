<script setup>
    import CardDesayunosComponent from "@/comida/presentation/inicio/presentation/CardDesayunos.component.vue";
    import {defineProps} from "vue";
    import {ComidaAssembler} from "@/comida/presentation/inicio/application/comidaAssembler.js";
    import {ComidasApiService} from "@/comida/presentation/inicio/application/comidas-api.service.js";
    import {onBeforeMount, ref} from "vue";

    const newsApiService = new ComidasApiService();

    const comidas = ref([])

    onBeforeMount(async () => {
      comidas.value = ComidaAssembler.toEntitiesFromResponse(await newsApiService.getArticles());

    });
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();

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