<script setup>
import {defineEmits, defineProps} from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  comida: {type: Object, required: true}
});

import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

function confirmarAccion() {
  confirm.require({
    group: 'add',
    message: 'Desayuno añadido',
    acceptLabel: 'Aceptar',
    accept: () => {
      console.log('Navegar al inicio')
    }
  })
}


</script>

<template>
  <Card class="custom-card">
    <!-- Imagen -->
    <template #header>
      <img class="card-image" v-if="comida.url"
           :src="comida.url"
           :alt="comida.url"
      >

      <div class="contenedor-info">
        <p>Kcal:{{comida.nutriente}}kcal</p>
        <p>Prote: {{ comida.prote }}g</p>
        <p>Carbo: {{ comida.carbo}}g</p>
        <p>Grasa: {{comida.grasa}}g</p>
      </div>
    </template>



    <!-- Título y descripción -->
    <template #title>
      <h2 class="card-title">{{ comida.nombre }}</h2>
    </template>
    <template #subtitle>


      <p class="card-subtitle">{{comida.complemento}}</p>
    </template>

    <!-- Botón -->
    <template #footer>
      <div class="card-footer">

        <Button @click="confirmarAccion" label="Añadir" class="add-button" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.custom-card {
  max-width: 300px;
  height: 500px;
  margin: auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;

}

.card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
}



.card-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 8px 0 4px;
}

.card-subtitle {
  font-size: 14px;
  text-align: center;
  padding: 0 12px;
  color: #444;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: center;
  padding-bottom: 16px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border-radius: 20px;
  padding: 8px 24px;
  border: none;
  font-weight: bold;
}

.contenedor-info{
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  border-radius: 10px;
  border: 1px solid black ;
  font-size: 12px;
  padding: 12px;
  width: 80%;
  margin: 10px auto
}
.card-image{
  width: 100%;
  height: 200px;
}

</style>