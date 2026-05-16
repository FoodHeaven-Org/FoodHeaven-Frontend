<script>
export default {
  name: 'AboutSectionComponent'
}
</script>

<template>
  <!-- Acerca De-->
  <section id="acerca">
    <div class="acerca-contenido">
      <div class="acerca-img">
        <img src="@/assets/images/imagenPortada.jpg" alt="Comida" />
      </div>
      <div class="acerca-texto">
        <img src="@/assets/images/logo.png" alt="Logo" width="80" class="mb-3" />
        <p>
          {{ $t('homePage.textAbout') }}
        </p>
        <a href="register.html" class="portada-button">{{ $t('homePage.register') }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>