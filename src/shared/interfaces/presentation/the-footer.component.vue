<script>
export default {
  name: 'TheFooterComponent',
}
</script>

<template>
  <footer class="bg-gray text-white pt-5 pb-0 mt-5 footer">
    <div class="container">
      <!-- Línea blanca que separa el footer -->
      <hr class="border-top border-white opacity-100" />

      <div class="row text-center text-md-start">
        <!-- Redes sociales -->
        <div class="col-md-4 mb-4">
          <h5>{{ $t('homePage.follow') }}</h5>
          <div class="mt-3">
            <a href="#" class="text-white me-3"
            ><i class="bi bi-facebook fs-4"></i
            ></a>
            <a href="#" class="text-white me-3"
            ><i class="bi bi-instagram fs-4"></i
            ></a>
            <a href="#" class="text-white me-3"
            ><i class="bi bi-twitter fs-4"></i
            ></a>
            <a href="#" class="text-white me-3"
            ><i class="bi bi-linkedin fs-4"></i
            ></a>
            <a href="#" class="text-white"
            ><i class="bi bi-envelope-fill fs-4"></i
            ></a>
          </div>
        </div>

        <!-- Enlaces legales -->
        <div class="col-md-4 mb-4">
          <h5>{{ $t('homePage.info') }}</h5>
          <ul class="list-unstyled mt-3">
            <li>
              <a href="Interfaces/legal-notice.html" class="text-white text-decoration-none"
              >{{ $t('homePage.advice') }}</a
              >
            </li>
            <li>
              <a href="Interfaces/privacy-policy.html" class="text-white text-decoration-none"
              >{{ $t('homePage.policyPriv') }}</a
              >
            </li>
            <li>
              <a href="Interfaces/cookies-policy.html" class="text-white text-decoration-none"
              >{{ $t('homePage.policyCook') }}</a
              >
            </li>
          </ul>
        </div>

        <!-- Soporte -->
        <div class="col-md-4 mb-4">
          <h5>{{ $t('homePage.support') }}</h5>
          <ul class="list-unstyled mt-3">
            <li>
              <a href="#" class="text-white text-decoration-none"
              >{{ $t('homePage.contactSupport') }}</a
              >
            </li>
            <li>
              <a href="#" class="text-white text-decoration-none"
              >{{ $t('homePage.help') }}</a
              >
            </li>
            <li>
              <a href="Interfaces/faq.html" class="text-white text-decoration-none"
              >{{ $t('homePage.questions') }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-secundary text-center py-3 mt-4">
      <p class="mb-0 text-white">
        &copy; 2025 <strong>FoodHeaven</strong>. {{ $t('homePage.rights') }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer{
  background-image: url('@/assets/images/fondoComida2.avif');
}
</style>