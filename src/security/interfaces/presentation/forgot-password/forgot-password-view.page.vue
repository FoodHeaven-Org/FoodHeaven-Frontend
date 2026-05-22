<script setup>
import { ref } from 'vue'
import LanguageSwitcher from '@/shared/interfaces/presentation/language-switcher.component.vue'
import ThemeToggle from '@/shared/interfaces/presentation/theme-toggle.component.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const statusMessage = ref('')

async function handleRecoveryRequest() {
  errorMessage.value = ''
  statusMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = t('forgotPassword.errorRequired')
    return
  }

  isSubmitting.value = true

  window.setTimeout(() => {
    statusMessage.value = t('forgotPassword.success')
    isSubmitting.value = false
  }, 500)
}
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

    <main class="forgot-shell">
      <section class="forgot-panel">
        <div class="forgot-panel__inner">
          <header class="forgot-header">
            <h1>{{ $t('forgotPassword.title') }}</h1>
            <p>{{ $t('forgotPassword.subtitle') }}</p>
          </header>

          <form class="forgot-form" @submit.prevent="handleRecoveryRequest" novalidate>
            <div class="form-field">
              <label for="recovery-email">{{ $t('forgotPassword.email') }}</label>
              <div class="input-wrapper">
                <i class="pi pi-envelope input-wrapper__icon" aria-hidden="true"></i>
                <input
                    id="recovery-email"
                    v-model="email"
                    class="fh-input has-icon"
                    type="email"
                    autocomplete="email"
                    :placeholder="$t('login.emailPlaceholder')"
                    required
                />
              </div>
            </div>

            <p v-if="errorMessage" class="form-message form-message--error" role="alert">
              <i class="pi pi-exclamation-circle"></i>
              {{ errorMessage }}
            </p>

            <p v-if="statusMessage" class="form-message form-message--success" role="status">
              <i class="pi pi-check-circle"></i>
              {{ statusMessage }}
            </p>

            <button class="fh-btn fh-btn--primary forgot-submit" type="submit" :disabled="isSubmitting">
              <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
              <span>{{ $t('forgotPassword.button') }}</span>
            </button>
          </form>

          <div class="forgot-links">
            <RouterLink :to="{ name: 'Login' }">{{ $t('forgotPassword.backToLogin') }}</RouterLink>
            <span aria-hidden="true">·</span>
            <RouterLink :to="{ name: 'Register' }">{{ $t('login.registerLink') }}</RouterLink>
          </div>
        </div>
      </section>

      <aside class="forgot-hero" aria-hidden="true"></aside>
    </main>
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

.forgot-shell {
  display: grid;
  grid-template-columns: minmax(360px, 0.9fr) minmax(0, 1.1fr);
  min-height: 100vh;
  overflow: hidden;
}

.forgot-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 96px 64px 56px;
}

.forgot-panel__inner {
  width: 100%;
  max-width: 390px;
}

.forgot-header {
  margin-bottom: 28px;
}

.forgot-header h1 {
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 2.1rem;
  font-weight: 700;
  line-height: 1.15;
}

.forgot-header p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
}

.input-wrapper {
  position: relative;
}

.input-wrapper__icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-soft);
  font-size: 0.95rem;
  pointer-events: none;
}

.has-icon {
  padding-left: 44px;
}

.form-message {
  margin: 0;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
}

.form-message--error {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.form-message--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.forgot-submit {
  width: 100%;
  padding: 14px 22px;
}

.forgot-links {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-soft);
  font-size: 0.88rem;
  font-weight: 600;
}

.forgot-links a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

.forgot-links a:hover {
  color: var(--color-primary-strong);
  text-decoration: underline;
}

.forgot-hero {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background-image:
      linear-gradient(135deg, rgba(7, 11, 8, 0.55) 0%, rgba(31, 27, 20, 0.25) 100%),
      url('/imgLoginRegister.jpg');
  background-size: cover;
  background-position: center;
}

@media (max-width: 980px) {
  .forgot-shell {
    grid-template-columns: 1fr;
  }

  .forgot-hero {
    display: none;
  }

  .forgot-panel {
    padding: 110px 32px 48px;
  }
}

@media (max-width: 520px) {
  .auth-page__header {
    padding: 14px 16px;
  }

  .auth-brand__text {
    font-size: 1.1rem;
  }

  .forgot-panel {
    padding: 100px 20px 40px;
  }

  .forgot-header h1 {
    font-size: 1.9rem;
  }
}
</style>
