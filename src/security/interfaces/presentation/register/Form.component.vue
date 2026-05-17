<template>
  <div class="register-shell">
    <section class="register-panel">
      <div class="register-panel__inner">
        <header class="register-header">
          <h1 class="register-title">{{ $t('register.title') }}</h1>
          <p class="register-subtitle">{{ $t('register.subtitle') }}</p>
        </header>

        <form class="register-form" @submit.prevent="handleRegister" novalidate>
          <fieldset class="register-fieldset">
            <legend>{{ $t('account.dataSecurity') }}</legend>

            <div class="field-grid">
              <div class="form-field wide-field">
                <label for="fullName">{{ $t('account.name') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-user input-wrapper__icon" aria-hidden="true"></i>
                  <input id="fullName" type="text" v-model="fullName" class="fh-input has-icon" required />
                </div>
              </div>

              <div class="form-field">
                <label for="email">{{ $t('register.email') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-envelope input-wrapper__icon" aria-hidden="true"></i>
                  <input id="email" type="email" v-model="email" class="fh-input has-icon" autocomplete="email" required />
                </div>
              </div>

              <div class="form-field">
                <label for="password">{{ $t('register.password') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-lock input-wrapper__icon" aria-hidden="true"></i>
                  <input
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      class="fh-input has-icon has-trailing"
                      autocomplete="new-password"
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
            </div>
          </fieldset>

          <fieldset class="register-fieldset">
            <legend>{{ $t('cuenta.datos') }}</legend>

            <div class="field-grid">
              <div class="form-field">
                <label for="phone">{{ $t('account.phone') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-phone input-wrapper__icon" aria-hidden="true"></i>
                  <input id="phone" type="tel" v-model="phone" class="fh-input has-icon" required />
                </div>
              </div>

              <div class="form-field">
                <label for="city">{{ $t('account.city') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-map-marker input-wrapper__icon" aria-hidden="true"></i>
                  <input id="city" type="text" v-model="city" class="fh-input has-icon" required />
                </div>
              </div>

              <div class="form-field wide-field">
                <label for="address">{{ $t('account.address') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-home input-wrapper__icon" aria-hidden="true"></i>
                  <input id="address" type="text" v-model="address" class="fh-input has-icon" required />
                </div>
                <div class="location-actions">
                  <input
                      v-model="addressLabel"
                      class="fh-input location-actions__label"
                      type="text"
                      :placeholder="$t('settings.locationLabelPlaceholder')"
                  />
                  <button class="fh-btn fh-btn--ghost" type="button" :disabled="isLocating" @click="detectLocation">
                    <i v-if="isLocating" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-map-marker"></i>
                    <span>{{ $t('settings.useCurrentLocation') }}</span>
                  </button>
                </div>
                <div v-if="mapPreviewUrl" class="map-preview">
                  <iframe
                      :src="mapPreviewUrl"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      :title="$t('settings.mapPreview')"
                  ></iframe>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="register-fieldset">
            <legend>{{ $t('account.paymentMethod') }} & {{ $t('account.subscription') }}</legend>

            <div class="field-grid">
              <div class="form-field wide-field">
                <label for="subscription">{{ $t('account.subscription') }}</label>
                <select id="subscription" v-model="subscription" class="fh-select" required>
                  <option v-for="plan in SUBSCRIPTION_PLANS" :key="plan.code" :value="plan.code">
                    {{ t(plan.nameKey) }} - S/ {{ plan.monthlyPrice }}
                  </option>
                </select>
              </div>

              <div class="form-field">
                <label for="cardNumber">{{ $t('settings.cardNumber') }}</label>
                <input id="cardNumber" v-model="cardNumber" class="fh-input" type="text" inputmode="numeric" autocomplete="cc-number" required />
              </div>

              <div class="form-field">
                <label for="cardExpiration">{{ $t('settings.cardExpiration') }}</label>
                <input id="cardExpiration" v-model="cardExpiration" class="fh-input" type="text" placeholder="MM/YY" autocomplete="cc-exp" required />
              </div>

              <div class="form-field">
                <label for="cardCvv">{{ $t('settings.cardCvv') }}</label>
                <input id="cardCvv" v-model="cardCvv" class="fh-input" type="password" inputmode="numeric" autocomplete="cc-csc" required />
              </div>
            </div>
            <p class="payment-note">{{ $t('settings.cardSafetyNote') }}</p>
          </fieldset>

          <p v-if="errorMessage" class="form-error" role="alert">
            <i class="pi pi-exclamation-circle"></i>
            {{ errorMessage }}
          </p>

          <button class="fh-btn fh-btn--primary register-submit" type="submit" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            <span>{{ $t('register.button') }}</span>
          </button>
        </form>

        <p class="extra-link">
          {{ $t('register.already') }}
          <RouterLink :to="{ name: 'Login' }">{{ $t('register.login') }}</RouterLink>
        </p>
      </div>
    </section>

    <aside class="register-hero" aria-hidden="true">
      <div class="register-hero__content">
        <h2>{{ $t('homePage.textHero2') }}</h2>
        <p>{{ $t('homePage.textAbout') }}</p>
        <ul class="register-hero__list">
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan') }}</li>
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan3') }}</li>
          <li><i class="pi pi-check-circle"></i>{{ $t('homePage.plan5') }}</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { AuthApiService } from '@/security/application/internal/auth-api.service.js'
import { SUBSCRIPTION_PLANS } from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'

const { t } = useI18n()
const router = useRouter()
const authApiService = new AuthApiService()

const fullName = ref('')
const email = ref('')
const password = ref('')
const subscription = ref('Full')
const phone = ref('')
const city = ref('')
const address = ref('')
const addressLabel = ref('Casa')
const latitude = ref(null)
const longitude = ref(null)
const cardNumber = ref('')
const cardCvv = ref('')
const cardExpiration = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)
const isLocating = ref(false)

const mapPreviewUrl = computed(() => {
  const coordinates = latitude.value && longitude.value
      ? `${latitude.value},${longitude.value}`
      : ''
  const query = coordinates || address.value

  if (!query) return ''

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const detectLocation = () => {
  errorMessage.value = ''

  if (!navigator.geolocation) {
    errorMessage.value = t('settings.locationUnavailable')
    return
  }

  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        latitude.value = Number(coords.latitude.toFixed(6))
        longitude.value = Number(coords.longitude.toFixed(6))
        if (!address.value) {
          address.value = `${latitude.value}, ${longitude.value}`
        }
        isLocating.value = false
      },
      () => {
        errorMessage.value = t('settings.locationUnavailable')
        isLocating.value = false
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
}

const handleRegister = async () => {
  errorMessage.value = ''

  const parsedPhone = Number(String(phone.value).replace(/\D/g, ''))

  if (!fullName.value || !email.value || !password.value || !subscription.value
      || !parsedPhone || !city.value || !address.value || !cardNumber.value || !cardCvv.value || !cardExpiration.value) {
    errorMessage.value = t('register.errorRequired')
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = t('register.errorLength')
    return
  }

  isSubmitting.value = true
  try {
    await authApiService.signUp({
      fullName: fullName.value.trim(),
      username: email.value,
      password: password.value,
      subscription: subscription.value,
      phone: parsedPhone,
      city: city.value,
      address: address.value,
      deliveryAddresses: [{
        label: addressLabel.value || 'Casa',
        addressLine: address.value,
        latitude: latitude.value,
        longitude: longitude.value,
        isDefault: true
      }],
      cardNumber: cardNumber.value,
      cardCvv: cardCvv.value,
      cardExpiration: cardExpiration.value
    })
    await router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message ?? 'Unable to register this user.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  min-height: 100vh;
  width: 100%;
}

.register-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 110px 56px 56px;
  background: var(--color-bg);
}

.register-panel__inner {
  width: 100%;
  max-width: 600px;
}

.register-header {
  margin-bottom: 24px;
}

.register-title {
  font-size: 2.3rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text);
  line-height: 1.15;
}

.register-subtitle {
  color: var(--color-text-muted);
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
}

.register-fieldset {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px 22px 12px;
  background: var(--color-surface);
}

.register-fieldset legend {
  padding: 0 8px;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.wide-field { grid-column: 1 / -1; }

.form-field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
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

.has-icon { padding-left: 44px; }
.has-trailing { padding-right: 44px; }

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
}

.input-wrapper__trailing:hover {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.location-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  margin-top: 10px;
}

.location-actions__label {
  min-width: 0;
}

.map-preview {
  margin-top: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface-2);
  aspect-ratio: 16 / 7;
}

.map-preview iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.payment-note {
  margin: 12px 0 0;
  color: var(--color-text-soft);
  font-size: 0.82rem;
  line-height: 1.4;
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

.register-submit {
  width: 100%;
  padding: 14px 22px;
  font-size: 1rem;
  margin-top: 4px;
}

.extra-link {
  margin-top: 22px;
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

.register-hero {
  position: relative;
  overflow: hidden;
  background-image:
      linear-gradient(135deg, rgba(7, 11, 8, 0.72) 0%, rgba(31, 27, 20, 0.42) 100%),
      url('/imgLoginRegister.jpg');
  background-size: cover;
  background-position: center;
  color: white;
}

.register-hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 64px;
  max-width: 540px;
}

.register-hero__content h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.register-hero__content p {
  margin: 0;
  font-size: 1.02rem;
  opacity: 0.94;
  line-height: 1.5;
}

.register-hero__list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-weight: 500;
  font-size: 1rem;
}

.register-hero__list li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.register-hero__list i {
  color: #c6f6d5;
  font-size: 1.1rem;
}

@media (max-width: 980px) {
  .register-shell {
    grid-template-columns: 1fr;
  }

  .register-hero { display: none; }

  .register-panel { padding: 110px 32px 48px; }
}

@media (max-width: 640px) {
  .field-grid,
  .location-actions {
    grid-template-columns: 1fr;
  }

  .register-panel { padding: 100px 20px 40px; }
  .register-title { font-size: 1.9rem; }
  .register-fieldset { padding: 14px 16px 8px; }
}
</style>
