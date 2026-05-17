<script setup>
import FormComponent from '@/security/interfaces/presentation/login/form.component.vue'
import LanguageSwitcher from '@/shared/interfaces/presentation/language-switcher.component.vue'
import ThemeToggle from '@/shared/interfaces/presentation/theme-toggle.component.vue'
</script>

<template>
  <div class="auth-page">
    <header class="auth-page__header">
      <RouterLink :to="{ name: 'Login' }" class="auth-brand" aria-label="FoodHeaven">
        <img src="/logoFoodHeaven.png" alt="" class="auth-brand__logo" />
        <span class="auth-brand__text">
          <span class="auth-brand__text-primary">Food</span><span class="auth-brand__text-secondary">Heaven</span>
        </span>
      </RouterLink>
      <div class="auth-page__controls">
        <ThemeToggle />
        <LanguageSwitcher variant="compact" />
      </div>
    </header>

    <FormComponent />
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.auth-page__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  z-index: 10;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  text-decoration: none;
}

.auth-brand__logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.auth-brand__text {
  font-size: 1.35rem;
  font-weight: 700;
}

.auth-brand__text-primary { color: var(--color-primary); }
.auth-brand__text-secondary { color: var(--color-text); }

.auth-page__controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 700px) {
  .auth-page__header {
    padding: 14px 16px;
  }

  .auth-brand__text {
    font-size: 1.1rem;
  }
}
</style>
