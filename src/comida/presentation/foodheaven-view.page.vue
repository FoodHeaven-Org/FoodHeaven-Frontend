<script setup>
import ToolbarComponent from '@/comida/presentation/tool-bar.component.vue';
</script>

<template>
  <div class="foodheaven-view">

    <ToolbarComponent></ToolbarComponent>

    <!-- Contenido de las vistas, debe tener un <router-view /> donde se renderizan las vistas hijas -->
    <router-view />
  </div>
</template>

<style scoped>

</style>
