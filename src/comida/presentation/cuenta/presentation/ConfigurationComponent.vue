<script setup>
  import ToolbarComponent from "@/components/ToolbarComponent.vue";
  import CuentaComponent from "@/components/CuentaComponent.vue";
  import ContraseñaSeguridadComponent from "@/components/ContraseñaSeguridadComponent.vue";
  import SuscripcionesComponent from "@/components/SuscripcionesComponent.vue";
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <ToolbarComponent></ToolbarComponent>
  <h3 class="configuracion">{{$t('configuracion.conf')}}</h3>
  <hr>
  <CuentaComponent></CuentaComponent>
  <ContraseñaSeguridadComponent></ContraseñaSeguridadComponent>
  <SuscripcionesComponent></SuscripcionesComponent>
</template>

<style scoped>
.configuracion{
  margin-left:3rem;
  font-family: Poppins;
}
</style>