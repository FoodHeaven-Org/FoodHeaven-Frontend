<script setup>
defineProps({
  count: { type: Number, default: 12 }
})
</script>

<template>
  <div class="contenedor">
    <h2>{{ $t('cuadro.title') }} <span>{{ count }}</span></h2>
    <p>{{ $t('cuadro.text') }}</p>
  </div>
</template>

<style scoped>
h2 {
  font-size: 20px;
}

.contenedor {
  width: 400px;
  padding: 40px;
  min-height: 200px;
  border-radius: 10px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contenedor span {
  color: white;
  background-color: #53b453;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
}

@media (max-width: 680px) {
  .contenedor {
    width: calc(100vw - 40px);
    padding: 20px;
  }
}
</style>
