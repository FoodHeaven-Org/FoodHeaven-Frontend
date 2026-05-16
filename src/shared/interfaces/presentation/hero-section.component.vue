<script>
export default {
  name: 'HeroSectionComponent'
}
</script>

<template>
  <section class="hero-section">
    <div
        class="container d-flex align-items-center justify-content-center fs-1 text-white flex-column"
    >
      <h3 class="text-center">
        {{ $t('homePage.textHero') }}
      </h3>
      <p>{{ $t('homePage.textHero2') }}</p>
      <a href="register.html" class="signin-button">{{ $t('homePage.register') }}</a>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background-image: url('@/assets/images/fondoComida.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>