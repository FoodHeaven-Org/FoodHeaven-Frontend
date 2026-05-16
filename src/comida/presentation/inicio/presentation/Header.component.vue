<script setup>
import pv_cuadro from "@/comida/presentation/inicio/presentation/Cuadro.component.vue";
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const selectedDay = ref(null);

function selectDay(day) {
  selectedDay.value = day;
  console.log(day)

}

</script>

<template>
  <h1>{{ $t('header.title') }}</h1>
  <p>{{ $t('header.paragraph1') }} <span>{{ $t('header.span') }}</span> {{ $t('header.paragraph2') }}</p>

  <div class="contenedor-header">

    <pv_cuadro/>

  </div>

  <div class="contenedor-fechas">
    <Button
        v-for="(label, index) in [
        t('cuadro.dia1'), t('cuadro.dia2'), t('cuadro.dia3'),
        t('cuadro.dia4'), t('cuadro.dia5'), t('cuadro.dia6'),
        t('cuadro.dia7')
      ]"
        :key="index"
        :label="label"
        class="contenedor_dia"
        :class="{ activo: selectedDay === index}"
        @click="selectDay(index)"
    />
  </div>



</template>

<style scoped>
  h1{
    margin: 20px;
    text-align: center;
    font-size: 40px;
  }

  p{
    text-align: center;
    margin-bottom: 30px;
  }
  span{
    font-weight: bold;
  }

  .contenedor-header{
    display: flex;
    justify-content: center;
    height: 300px;
  }
  .contenedor-fechas{
    display: flex;
    max-width: 900px;
    margin: 0 auto;
    justify-content: space-between;
  }

  .contenedor-fechas .contenedor_dia {
    text-decoration: none;
    color: black;
    border: 1px solid black;
    padding: 15px 20px;
    border-radius: 10px;
    transition: all 0.3s ease;
    background-color: white;

  }

  .contenedor-fechas .contenedor_dia:hover {
    background-color: #45ce45;
    border: none;
    color: white;
  }

  .activo {
    background-color: #2ecc71 !important;
    color: white !important;
    font-weight: bold;
    border: none;
  }

</style>