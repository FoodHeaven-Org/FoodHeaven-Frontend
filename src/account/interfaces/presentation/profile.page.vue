<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'
import { getSubscriptionPlan } from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'
import { clearSession } from '@/security/application/internal/auth-api.service.js'
import { useI18n } from 'vue-i18n'

const accountApiService = new AccountApiService()
const router = useRouter()
const { t } = useI18n()
const profile = ref(null)
const isLoading = ref(true)
const isDeleting = ref(false)
const errorMessage = ref('')

const displayName = computed(() => {
  const fullName = profile.value?.fullName ?? profile.value?.FullName ?? ''
  if (fullName) return fullName
  return t('account.defaultName')
})

const subscriptionPlan = computed(() => getSubscriptionPlan(profile.value?.subscription ?? profile.value?.Subscription))

const subscriptionName = computed(() => profile.value ? t(subscriptionPlan.value.nameKey) : '')
const subscriptionPrice = computed(() => profile.value ? `S/ ${subscriptionPlan.value.monthlyPrice}` : '')

onBeforeMount(async () => {
  try {
    profile.value = await accountApiService.getCurrentProfile()
  } catch (error) {
    console.error(error)
    errorMessage.value = t('settings.loadError')
  } finally {
    isLoading.value = false
  }
})

function formatPhone(phone) {
  return phone ? `+${phone}` : t('account.notProvided')
}

function formatText(value) {
  return value || t('account.notProvided')
}

function goToSettings(tab = 'profile') {
  router.push({ name: 'Configuracion', query: { tab } })
}

async function deleteAccount() {
  if (!window.confirm(t('account.deleteConfirm'))) return

  isDeleting.value = true
  errorMessage.value = ''

  try {
    await accountApiService.deleteCurrentAccount()
    clearSession()
    await router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message ?? t('account.deleteError')
  } finally {
    isDeleting.value = false
  }
}

const dataRows = computed(() => [
  { label: t('account.name'),          value: displayName.value },
  { label: t('account.email'),         value: formatText(profile.value?.username) },
  { label: t('account.phone'),         value: formatPhone(profile.value?.phone) },
  { label: t('account.city'),          value: formatText(profile.value?.city) },
  { label: t('account.address'),       value: formatText(profile.value?.address) },
  { label: t('account.paymentMethod'), value: formatText(profile.value?.paymentMethod) }
])
</script>

<template>
  <section class="account-page fh-container">
    <div v-if="isLoading" class="account-loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>{{ t('account.loading') }}</span>
    </div>

    <p v-else-if="errorMessage" class="account-error">
      {{ errorMessage }}
    </p>

    <template v-else-if="profile">
      <header class="account-greeting">
        <span class="account-greeting__welcome">{{ t('welcome') }},</span>
        <h1 class="account-greeting__name">{{ displayName }}</h1>
      </header>

      <article class="account-plan">
        <div class="account-plan__copy">
          <span class="account-plan__label">{{ t('plan.current') }}</span>
          <h2 class="account-plan__name">{{ subscriptionName }}</h2>
          <p class="account-plan__price">{{ subscriptionPrice }} <span>/ {{ t('homePage.month') }}</span></p>
        </div>
        <button class="fh-btn fh-btn--ghost account-plan__cta" type="button" @click="goToSettings('plan')">
          {{ t('plan.change') }}
        </button>
      </article>

      <article class="account-card fh-card">
        <header class="account-card__header">
          <div>
            <h2>{{ t('account.dataSecurity') }}</h2>
            <p>{{ t('cuenta.infodata') }}</p>
          </div>
          <button class="fh-btn fh-btn--primary" type="button" @click="goToSettings('profile')">
            {{ t('account.editProfile') }}
          </button>
        </header>

        <dl class="account-data">
          <div v-for="row in dataRows" :key="row.label" class="account-data__row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </article>

      <article class="account-card fh-card">
        <header class="account-card__header">
          <div>
            <h2>{{ t('pswsecu.title') }}</h2>
            <p>{{ t('pswsecu.descripcion') }}</p>
          </div>
        </header>
        <div class="account-card__actions">
          <button class="fh-btn fh-btn--ghost" type="button" @click="goToSettings('profile')">
            {{ t('pswsecu.cambiar') }}
          </button>
          <button class="fh-btn fh-btn--danger" type="button" :disabled="isDeleting" @click="deleteAccount">
            {{ t('account.delete') }}
          </button>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-top: var(--space-8);
}

.account-loading,
.account-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  font-weight: 600;
}

.account-error {
  color: var(--color-danger);
}

/* Friendly greeting, no avatar */
.account-greeting {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-greeting__welcome {
  font-size: 1rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.account-greeting__name {
  margin: 0;
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

/* Current plan banner — warm green pill that feels celebratory, not corporate */
.account-plan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 22px 28px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-strong) 100%);
  color: var(--color-text-inverse);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-brand);
  flex-wrap: wrap;
}

.account-plan__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-plan__label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.92;
  font-weight: 600;
}

.account-plan__name {
  margin: 4px 0 2px;
  font-size: 1.4rem;
  font-weight: 700;
}

.account-plan__price {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.95;
}

.account-plan__price span {
  font-size: 0.86rem;
  opacity: 0.85;
}

.account-plan__cta {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-surface);
}

.account-plan__cta:hover {
  background: var(--color-bg-soft);
  border-color: var(--color-bg-soft);
  color: var(--color-primary);
}

/* Card sections */
.account-card {
  padding: 22px 26px 24px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.account-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.account-card__header h2 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}

.account-card__header p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.account-data {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--color-divider);
}

.account-data__row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-divider);
}

/* Make rows span only their grid column, but the bottom border ties them together */
.account-data__row:nth-child(odd) { padding-right: 16px; }
.account-data__row:nth-child(even) { padding-left: 16px; border-left: 1px solid var(--color-divider); }

.account-data__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-soft);
}

.account-data__row dd {
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.98rem;
  word-break: break-word;
}

.account-card__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.account-card__actions .fh-btn {
  flex: 1;
  min-width: 180px;
}

@media (max-width: 720px) {
  .account-plan {
    align-items: flex-start;
    padding: 20px 22px;
  }
  .account-plan__cta { width: 100%; }
  .account-card { padding: 20px 22px 22px; }
  .account-card__header { flex-direction: column; }
  .account-card__header .fh-btn { width: 100%; }
  .account-data { grid-template-columns: 1fr; }
  .account-data__row:nth-child(odd) { padding-right: 0; }
  .account-data__row:nth-child(even) { padding-left: 0; border-left: none; }
}
</style>
