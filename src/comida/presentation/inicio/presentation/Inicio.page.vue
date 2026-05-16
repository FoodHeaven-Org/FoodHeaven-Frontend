<script setup>
import pv_header from "@/comida/presentation/inicio/presentation/Header.component.vue";
import pv_desayunos from "@/comida/presentation/inicio/presentation/Desayunos.component.vue";
import pv_almuerzos from "@/comida/presentation/inicio/presentation/Almuerzos.component.vue"
import pv_cenas from "@/comida/presentation/inicio/presentation/Cenas.component.vue";

</script>

<template>
  <ConfirmDialog group="add">
    <template #container="{ message, acceptCallback }">
      <div class="confirmDialog">
        <p class="mensaje">{{ message.message }}</p>
        <div class="acciones">
          <button class="rechazar" @click="acceptCallback">{{ message.acceptLabel }}</button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <pv_header/>
  <pv_desayunos/>
  <pv_almuerzos/>
  <pv_cenas/>

</template>

<style scoped>

</style>