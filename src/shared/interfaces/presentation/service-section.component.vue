<script>
export default {
  name: 'ServiceSectionComponent',
}
</script>

<template>
  <!-- Servicios -->
  <section class="container mt-5" id="servicios">
    <h1 class="text-center mb-4">{{ $t('homePage.service') }}</h1>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-calendar-check display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Selección de Proveedores -->
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-shop-window display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan2') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService2') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Control Nutricional -->
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-heart-pulse-fill display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan3') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService3') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Entregas Flexibles -->
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-truck display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan4') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService4') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Reservas Especiales -->
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-star-fill display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan5') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService5') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Suscripción Flexible -->
      <div class="col">
        <div class="card h-100 text-center servicio">
          <div class="card-body">
            <i class="bi bi-credit-card-2-front-fill display-4 mb-3"></i>
            <h2 class="card-title">{{ $t('homePage.plan6') }}</h2>
            <p class="card-text">
              {{ $t('homePage.textService6') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>