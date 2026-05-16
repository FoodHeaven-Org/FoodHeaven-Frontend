<script>
export default {
  name: 'ReviewSectionComponent',
}
</script>

<template>
  <!-- Reseñas -->
  <section class="container my-5" id="reseñas">
    <h1 class="text-center mb-5">{{ $t('homePage.review') }}</h1>
    <div class="row g-4 justify-content-center">
      <!-- Reseña 1 - Profesional Joven -->
      <div class="col-lg-4 col-md-6 d-flex">
        <div
            class="card p-4 text-white border-white w-100 rounded-4 shadow-lg"
        >
          <div class="d-flex align-items-center mb-4">
            <img src="@/assets/images/resena3.jpg" alt="Clara Cortés" class="rounded-circle me-4" width="80" height="80" />
            <div>
              <h2 class="mb-1 fs-4">Clara Cortés</h2>
              <small class="text-secondary fs-6">{{ $t('homePage.review1') }}</small
              ><br />
              <span class="text-warning fs-5">★★★★★</span>
            </div>
          </div>
          <p class="fs-5" style="color: gray">
            {{ $t('homePage.reviewText') }}
          </p>
        </div>
      </div>
      <!-- Reseña 2 - Padre de familia -->
      <div class="col-lg-4 col-md-6 d-flex">
        <div
            class="card p-4 text-white border-white w-100 rounded-4 shadow-lg"
        >
          <div class="d-flex align-items-center mb-4">
            <img src="@/assets/images/resena2.jpg" alt="Leonardo Mesías" class="rounded-circle me-4" width="80" height="80" />
            <div>
              <h2 class="mb-1 fs-4">Leonardo Mesías</h2>
              <small class="text-secondary fs-6">{{ $t('homePage.review2') }}</small
              ><br />
              <span class="text-warning fs-5">★★★★☆</span>
            </div>
          </div>
          <p class="fs-5" style="color: gray">
            {{ $t('homePage.reviewText2') }}
          </p>
        </div>
      </div>
      <!-- Reseña 3 - Profesional Joven -->
      <div class="col-lg-4 col-md-6 d-flex">
        <div
            class="card p-4 text-white border-white w-100 rounded-4 shadow-lg"
        >
          <div class="d-flex align-items-center mb-4">
            <img src="@/assets/images/resena1.jpg" alt="Daniel Moreno" class="rounded-circle me-4" width="80" height="80" />
            <div>
              <h2 class="mb-1 fs-4">Daniel Moreno</h2>
              <small class="text-secondary fs-6">{{ $t('homePage.review3') }}</small
              ><br />
              <span class="text-warning fs-5">★★★★★</span>
            </div>
          </div>
          <p class="fs-5" style="color: gray">
            {{ $t('homePage.reviewText3') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
