<script setup>
import FormComponent from '@/security/interfaces/presentation/login/form.component.vue'
import LanguageSwitcher from '@/shared/interfaces/presentation/language-switcher.component.vue'
</script>

<template>
  <div class="auth-page">
    <LanguageSwitcher class="auth-language-switcher" />
    <FormComponent />
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
}

.auth-language-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
</style>
