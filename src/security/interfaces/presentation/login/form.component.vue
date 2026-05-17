<template>
  <div class="login-shell">
    <section class="login-panel">
      <div class="login-panel__inner">
        <div class="login-header">
          <h1 class="login-title">{{ $t('login.title') }}</h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin" novalidate>
          <div class="form-field">
            <label for="email">{{ $t('login.email') }}</label>
            <div class="input-wrapper">
              <i class="pi pi-envelope input-wrapper__icon" aria-hidden="true"></i>
              <input
                  id="email"
                  type="email"
                  v-model="email"
                  class="fh-input has-icon"
                  :placeholder="$t('login.emailPlaceholder')"
                  autocomplete="email"
                  required
              />
            </div>
          </div>

          <div class="form-field">
            <label for="password">{{ $t('login.password') }}</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-wrapper__icon" aria-hidden="true"></i>
              <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  class="fh-input has-icon has-trailing"
                  :placeholder="$t('login.passwordPlaceholder')"
                  autocomplete="current-password"
                  required
                  minlength="6"
              />
              <button
                  type="button"
                  class="input-wrapper__trailing"
                  :aria-label="showPassword ? $t('login.hidePassword') : $t('login.showPassword')"
                  @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="form-error" role="alert">
            <i class="pi pi-exclamation-circle"></i>
            {{ errorMessage }}
          </p>

          <button class="fh-btn fh-btn--primary login-submit" type="submit" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            <span>{{ $t('login.button') }}</span>
          </button>
        </form>

        <p class="extra-link">
          {{ $t('login.registerText') }}
          <RouterLink :to="{ name: 'Register' }">{{ $t('login.registerLink') }}</RouterLink>
        </p>
      </div>
    </section>

    <aside class="login-hero" aria-hidden="true">
      <div class="login-hero__overlay"></div>
      <div class="login-hero__content">
        <h2>{{ $t('login.tagline') }}</h2>
        <p>{{ $t('homePage.textHero') }}</p>
        <ul class="login-hero__list">
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan') }}</li>
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan3') }}</li>
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan4') }}</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { AuthApiService } from '@/security/application/internal/auth-api.service.js'

const { t } = useI18n()
const authApiService = new AuthApiService()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = t('login.errorRequired')
    return
  }

  isSubmitting.value = true
  try {
    await authApiService.login({ username: email.value, password: password.value })
    await router.push({ name: 'Inicio' })
  } catch (error) {
    console.error(error)
    errorMessage.value = t('login.errorInvalid')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  min-height: 100vh;
  width: 100%;
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 96px 64px 56px;
  background: var(--color-bg);
}

.login-panel__inner {
  width: 100%;
  max-width: 440px;
}

.login-header {
  margin-bottom: 28px;
}

.login-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px;
  line-height: 1.15;
}

.login-subtitle {
  color: var(--color-text-muted);
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 16px;
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

.has-trailing {
  padding-right: 44px;
}

.input-wrapper__trailing {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  border: none;
  background: transparent;
  color: var(--color-text-soft);
  width: 34px;
  height: 34px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--duration-fast) ease, color var(--duration-fast) ease;
}

.input-wrapper__trailing:hover {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.form-error {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-danger-soft);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
}

.login-submit {
  width: 100%;
  padding: 14px 22px;
  font-size: 1rem;
  margin-top: 6px;
}

.extra-link {
  margin-top: 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.94rem;
}

.extra-link a {
  color: var(--color-primary);
  font-weight: 700;
}

.extra-link a:hover {
  color: var(--color-primary-strong);
  text-decoration: underline;
}

.login-hero {
  position: relative;
  overflow: hidden;
  background-image:
      linear-gradient(135deg, rgba(7, 11, 8, 0.72) 0%, rgba(31, 27, 20, 0.42) 100%),
      url('/imgLoginRegister.jpg');
  background-size: cover;
  background-position: center;
  color: white;
}

.login-hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 64px;
  max-width: 520px;
}

.login-hero__content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.15;
}

.login-hero__content p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  line-height: 1.55;
}

.login-hero__list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-weight: 500;
  font-size: 1rem;
}

.login-hero__list li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.login-hero__list i {
  color: #c6f6d5;
  font-size: 1.1rem;
}

@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-hero {
    display: none;
  }

  .login-panel {
    padding: 110px 32px 48px;
  }
}

@media (max-width: 520px) {
  .login-panel {
    padding: 100px 20px 40px;
  }

  .login-title {
    font-size: 1.9rem;
  }
}
</style>
