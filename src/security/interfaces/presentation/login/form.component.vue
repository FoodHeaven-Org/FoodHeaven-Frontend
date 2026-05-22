<template>
  <div class="login-shell">
    <section class="login-panel">
      <div class="login-panel__inner">
        <div class="login-header">
          <h1 class="login-title">{{ $t('login.title') }}</h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </div>

        <div class="social-login" aria-label="Social login options">
          <button class="social-login__button social-login__button--facebook" type="button" @click="showSocialUnavailable('Facebook')">
            <i class="pi pi-facebook" aria-hidden="true"></i>
            <span>Facebook</span>
          </button>
          <button class="social-login__button social-login__button--google" type="button" @click="showSocialUnavailable('Google')">
            <span class="social-login__google-mark" aria-hidden="true">G</span>
            <span>Google</span>
          </button>
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

        <div class="login-links">
          <RouterLink class="login-link" :to="{ name: 'ForgotPassword' }">{{ $t('login.forgotLink') }}</RouterLink>
          <RouterLink class="register-button" :to="{ name: 'Register' }">{{ $t('login.registerLink') }}</RouterLink>
        </div>
      </div>
    </section>

    <aside class="login-hero" aria-hidden="true">
      <div class="login-hero__image"></div>
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

const showSocialUnavailable = (provider) => {
  errorMessage.value = t('login.socialUnavailable', { provider })
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
  grid-template-columns: minmax(360px, 0.9fr) minmax(0, 1.1fr);
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
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
  max-width: 390px;
}

.login-header {
  margin-bottom: 28px;
}

.login-title {
  font-size: 2.1rem;
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

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 24px 0 8px;
}

.social-login__button {
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform var(--duration-fast) ease, border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}

.social-login__button:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xs);
  transform: translateY(-1px);
}

.social-login__button--facebook {
  background: #1877f2;
  border-color: #1877f2;
  color: #fff;
}

.social-login__button--facebook:hover {
  border-color: #145fbd;
}

.social-login__google-mark {
  font-weight: 800;
  color: #4285f4;
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

.login-links {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  font-size: 0.88rem;
  font-weight: 600;
}

.login-link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

.login-link:hover {
  color: var(--color-primary-strong);
  text-decoration: underline;
}

.register-button {
  width: 100%;
  min-height: 42px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  transition: background var(--duration-fast) ease, color var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.register-button:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  transform: translateY(-1px);
}

.login-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
      radial-gradient(circle at 20% 20%, var(--color-primary-soft), transparent 34%),
      var(--color-bg);
}

.login-hero__image {
  width: min(720px, 74vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background-image:
      linear-gradient(135deg, rgba(7, 11, 8, 0.18) 0%, rgba(31, 27, 20, 0.36) 100%),
      url('/imgLoginRegister.jpg');
  background-size: cover;
  background-position: center;
  box-shadow: -22px 28px 80px rgba(31, 27, 20, 0.22);
  transform: translateX(10%);
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

  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
