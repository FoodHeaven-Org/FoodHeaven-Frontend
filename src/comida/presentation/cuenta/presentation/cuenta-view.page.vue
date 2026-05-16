<script setup>
import CardCuentaComponent from "@/comida/presentation/cuenta/presentation/card-cuenta.component.vue";
</script>

<template>
  <div class="cuenta-page">
    <div class="contenido">
      <CardCuentaComponent />
    </div>
  </div>
</template>

<style scoped>
.cuenta-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Separación para que el contenido no quede oculto detrás del navbar */
.contenido {
  flex: 1;
  padding: 20px;
  margin-top: 10px; /* suficiente para despejar el navbar fijo */
}
</style>

