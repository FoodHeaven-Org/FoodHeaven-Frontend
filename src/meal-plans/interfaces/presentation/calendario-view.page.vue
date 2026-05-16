<script setup>
import Calendario from "./calendario.component.vue"
import Boton from "./button-calendarios.component.vue"
import { useI18n } from 'vue-i18n';
const { t  } = useI18n();
</script>

<template>
  <h1 class="titulo">{{ $t('calendar.title') }}</h1>
  <h2 class="subtitulo">{{$t('calendar.subtitle')}}</h2>
  <p class="policy-note">{{ $t('calendar.policyNote') }}</p>
  <hr class="margin-top"/>
  <Calendario/>

  <Boton />
</template>

<style scoped>
.margin-top{
  margin-bottom: 40px;
}

hr{
  margin: 0 10rem;
}

.titulo {
  color: black;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 65px 0 0;
  text-align: center;


}

.subtitulo {
  font-size: 1.2rem;
  font-weight: normal;
  color: black;
  margin: 10px 0 20px;
  text-align: center;
}

.policy-note {
  max-width: 900px;
  margin: 0 auto 22px;
  color: #2e7d32;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
}
</style>
