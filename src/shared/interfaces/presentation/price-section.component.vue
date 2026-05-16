<script>
export default {
  name: 'PriceSectionComponent',
}
</script>

<template>
  <!-- Sección de Precios -->
  <section class="container my-5" id="precios">
    <h1 class="text-center mb-4">{{ $t('homePage.price') }}</h1>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      <!-- Plan Estándar -->
      <div class="col d-flex">
        <div
            class="card text-center precio-card w-100 text-white border-green precio-f"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h2 class="card-title nowrap">{{ $t('homePage.price1') }}</h2>
              <h3 class="card-subtitle text-black price nowrap">
                S/ 400.00 / {{ $t('homePage.month') }}
              </h3>
              <ul class="list-unstyled mt-4 mb-4 text-start mx-auto">
                <li>✓ {{ $t('homePage.planText1') }}</li>
                <li>✓ {{ $t('homePage.planText2') }}</li>
                <li>✓ {{ $t('homePage.planText3') }}</li>
              </ul>
            </div>
            <a href="login.html" class="btn btn-outline-light rounded-pill mt-auto"
            >{{ $t('homePage.choose') }}</a
            >
          </div>
        </div>
      </div>

      <!-- Plan Tempranero -->
      <div class="col d-flex">
        <div
            class="card text-center precio-card w-100 text-white border-green precio-f"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h2 class="card-title nowrap">{{ $t('homePage.price2') }}</h2>
              <h3 class="card-subtitle text-black price nowrap">
                S/ 500.00 / {{ $t('homePage.month') }}
              </h3>
              <ul class="list-unstyled mt-4 mb-4 text-start mx-auto">
                <li>✓ {{ $t('homePage.planText4') }}</li>
                <li>✓ {{ $t('homePage.planText2') }}</li>
                <li>✓ {{ $t('homePage.planText3') }}</li>
              </ul>
            </div>
            <a href="login.html" class="btn btn-outline-light rounded-pill mt-auto"
            >{{ $t('homePage.choose') }}</a
            >
          </div>
        </div>
      </div>

      <!-- Plan Bajadón -->
      <div class="col d-flex">
        <div
            class="card text-center precio-card w-100 text-white border-green precio-f"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h2 class="card-title nowrap">{{ $t('homePage.price3') }}</h2>
              <h3 class="card-subtitle text-black price nowrap">
                S/ 800.00 / {{ $t('homePage.month') }}
              </h3>
              <ul class="list-unstyled mt-4 mb-4 text-start mx-auto">
                <li>✓ {{ $t('homePage.planText5') }}</li>
                <li>✓ {{ $t('homePage.planText2') }}</li>
                <li>✓ {{ $t('homePage.planText3') }}</li>
              </ul>
            </div>
            <a href="login.html" class="btn btn-outline-light rounded-pill mt-auto"
            >{{ $t('homePage.choose') }}</a
            >
          </div>
        </div>
      </div>

      <!-- Plan Full -->
      <div class="col d-flex">
        <div
            class="card text-center precio-card w-100 text-white border-green precio-f"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h2 class="card-title nowrap">{{ $t('homePage.price4') }}</h2>
              <h3 class="card-subtitle text-black price nowrap">
                S/ 1000.00 / {{ $t('homePage.month') }}
              </h3>
              <ul class="list-unstyled mt-4 mb-4 text-start mx-auto">
                <li>✓ {{ $t('homePage.planText6') }}</li>
                <li>✓ {{ $t('homePage.planText2') }}</li>
                <li>✓ {{ $t('homePage.planText3') }}</li>
                <li>✓ {{ $t('homePage.planText7') }}</li>
              </ul>
            </div>
            <a href="login.html" class="btn btn-outline-light rounded-pill mt-auto"
            >{{ $t('homePage.choose') }}</a
            >
          </div>
        </div>
      </div>
    </div>
    <p class="text-center text-muted mt-5">
      *{{ $t('homePage.terms') }}
      <br />
      *{{ $t('homePage.terms2') }}
    </p>
  </section>
</template>

<style scoped>

</style>