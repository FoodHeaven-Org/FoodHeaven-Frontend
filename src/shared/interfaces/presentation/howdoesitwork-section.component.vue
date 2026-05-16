<script>
export default {
  name: 'HowdoesitworkSection',
}
</script>

<template>
  <!-- ¿Cómo Funciona? -->
  <section class="container mt-5" id="comofunciona">
    <h1 class="text-center mb-4">{{ $t('homePage.works') }}</h1>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-person-plus-fill display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works1') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-heart display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works2') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork2') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-calendar-event display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works3') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork3') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-cart-check display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works4') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork4') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-basket display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works5') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork5') }}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-graph-up display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.works6') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textWork6') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>