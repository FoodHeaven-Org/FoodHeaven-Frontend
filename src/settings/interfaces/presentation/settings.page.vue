<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'
import {
  getSubscriptionPlan,
  SUBSCRIPTION_PLANS
} from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'
import { useTheme } from '@/shared/application/theme.composable.js'
import LanguageSwitcher from '@/shared/interfaces/presentation/language-switcher.component.vue'
import ThemeToggle from '@/shared/interfaces/presentation/theme-toggle.component.vue'

const { t } = useI18n()
const route = useRoute()
const accountApiService = new AccountApiService()
const { theme } = useTheme()

const tabs = [
  { key: 'profile',     labelKey: 'settings.dataSecurityTitle' },
  { key: 'plan',        labelKey: 'settings.changePlanTitle' },
  { key: 'preferences', labelKey: 'settings.preferencesTitle' }
]

const activeTab = ref(resolveTab(route.query.tab))
const isLoading = ref(true)
const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const isSavingPlan = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')

const profileForm = ref({
  fullName: '',
  username: '',
  phone: '',
  city: '',
  address: '',
  paymentMethod: 'Card'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const selectedPlan = ref('Full')
const activePlan = computed(() => getSubscriptionPlan(selectedPlan.value))

onBeforeMount(loadProfile)

watch(() => route.query.tab, (tab) => {
  activeTab.value = resolveTab(tab)
})

function resolveTab(tab) {
  const nextTab = String(tab ?? 'profile')
  if (nextTab === 'security') return 'profile'
  return tabs.some(item => item.key === nextTab) ? nextTab : 'profile'
}

async function loadProfile() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const profile = await accountApiService.getCurrentProfile()

    profileForm.value = {
      fullName: profile.fullName ?? profile.FullName ?? '',
      username: profile.username ?? '',
      phone: String(profile.phone ?? ''),
      city: profile.city ?? '',
      address: profile.address ?? '',
      paymentMethod: profile.paymentMethod || 'Card'
    }
    selectedPlan.value = getSubscriptionPlan(profile.subscription).code
  } catch (error) {
    console.error(error)
    errorMessage.value = t('settings.loadError')
  } finally {
    isLoading.value = false
  }
}

function clearMessages() {
  statusMessage.value = ''
  errorMessage.value = ''
}

async function saveProfile() {
  clearMessages()
  isSavingProfile.value = true

  const parsedPhone = Number(String(profileForm.value.phone).replace(/\D/g, ''))

  if (!profileForm.value.fullName || !profileForm.value.username || !parsedPhone || !profileForm.value.city || !profileForm.value.address || !profileForm.value.paymentMethod) {
    errorMessage.value = t('settings.requiredError')
    isSavingProfile.value = false
    return
  }

  try {
    await accountApiService.updateCurrentProfile({
      fullName: profileForm.value.fullName,
      username: profileForm.value.username,
      phone: parsedPhone,
      city: profileForm.value.city,
      address: profileForm.value.address,
      paymentMethod: profileForm.value.paymentMethod
    })
    statusMessage.value = t('settings.profileSaved')
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message ?? t('settings.profileError')
  } finally {
    isSavingProfile.value = false
  }
}

async function savePassword() {
  clearMessages()
  isSavingPassword.value = true

  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    errorMessage.value = t('settings.requiredError')
    isSavingPassword.value = false
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    errorMessage.value = t('settings.passwordLengthError')
    isSavingPassword.value = false
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = t('settings.passwordMatchError')
    isSavingPassword.value = false
    return
  }

  try {
    await accountApiService.changeCurrentPassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    statusMessage.value = t('settings.passwordSaved')
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message ?? t('settings.passwordError')
  } finally {
    isSavingPassword.value = false
  }
}

async function savePlan() {
  clearMessages()
  isSavingPlan.value = true

  try {
    await accountApiService.changeCurrentSubscription(selectedPlan.value)
    statusMessage.value = t('settings.planSaved')
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message ?? t('settings.planError')
  } finally {
    isSavingPlan.value = false
  }
}
</script>

<template>
  <section class="settings-page fh-container">
    <header class="settings-page__header">
      <h1>{{ $t('settings.title') }}</h1>
      <p>{{ $t('settings.subtitle') }}</p>
    </header>

    <div class="settings-page__alerts">
      <p v-if="isLoading" class="alert alert--info"><i class="pi pi-spin pi-spinner"></i>{{ $t('settings.loading') }}</p>
      <transition name="fh-fade">
        <p v-if="statusMessage" class="alert alert--success"><i class="pi pi-check-circle"></i>{{ statusMessage }}</p>
      </transition>
      <transition name="fh-fade">
        <p v-if="errorMessage" class="alert alert--error"><i class="pi pi-exclamation-circle"></i>{{ errorMessage }}</p>
      </transition>
    </div>

    <nav v-if="!isLoading" class="settings-tabs" aria-label="Settings sections">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="['settings-tabs__btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
      >
        {{ $t(tab.labelKey) }}
      </button>
    </nav>

    <transition name="fh-fade" mode="out-in">
      <div v-if="!isLoading && activeTab === 'profile'" key="profile" class="settings-grid">
        <form class="settings-card fh-card" @submit.prevent="saveProfile">
          <header class="settings-card__header">
            <h2>{{ $t('settings.personalTitle') }}</h2>
          </header>

          <div class="settings-grid__fields">
            <label class="settings-field">
              <span>{{ $t('account.name') }}</span>
              <input v-model="profileForm.fullName" class="fh-input" type="text" />
            </label>

            <label class="settings-field">
              <span>{{ $t('account.email') }}</span>
              <input v-model="profileForm.username" class="fh-input" type="email" />
            </label>

            <label class="settings-field">
              <span>{{ $t('account.phone') }}</span>
              <input v-model="profileForm.phone" class="fh-input" type="tel" />
            </label>

            <label class="settings-field">
              <span>{{ $t('account.city') }}</span>
              <input v-model="profileForm.city" class="fh-input" type="text" />
            </label>

            <label class="settings-field settings-field--wide">
              <span>{{ $t('account.address') }}</span>
              <input v-model="profileForm.address" class="fh-input" type="text" />
            </label>

            <label class="settings-field settings-field--wide">
              <span>{{ $t('account.paymentMethod') }}</span>
              <select v-model="profileForm.paymentMethod" class="fh-select">
                <option value="Card">{{ $t('settings.paymentCard') }}</option>
                <option value="Yape">{{ $t('settings.paymentYape') }}</option>
                <option value="Cash">{{ $t('settings.paymentCash') }}</option>
              </select>
            </label>
          </div>

          <button class="fh-btn fh-btn--primary settings-card__submit" type="submit" :disabled="isSavingProfile">
            <i v-if="isSavingProfile" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-save"></i>
            <span>{{ $t('settings.saveProfile') }}</span>
          </button>
        </form>

        <form class="settings-card fh-card" @submit.prevent="savePassword">
          <header class="settings-card__header">
            <h2>{{ $t('settings.passwordTitle') }}</h2>
          </header>

          <div class="settings-grid__fields settings-grid__fields--single">
            <label class="settings-field">
              <span>{{ $t('settings.currentPassword') }}</span>
              <input v-model="passwordForm.currentPassword" class="fh-input" type="password" autocomplete="current-password" />
            </label>

            <label class="settings-field">
              <span>{{ $t('settings.newPassword') }}</span>
              <input v-model="passwordForm.newPassword" class="fh-input" type="password" autocomplete="new-password" />
            </label>

            <label class="settings-field">
              <span>{{ $t('settings.confirmPassword') }}</span>
              <input v-model="passwordForm.confirmPassword" class="fh-input" type="password" autocomplete="new-password" />
            </label>
          </div>

          <button class="fh-btn fh-btn--primary settings-card__submit" type="submit" :disabled="isSavingPassword">
            <i v-if="isSavingPassword" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-key"></i>
            <span>{{ $t('settings.savePassword') }}</span>
          </button>
        </form>
      </div>

      <section v-else-if="!isLoading && activeTab === 'plan'" key="plan" class="plans-panel">
        <p class="plans-panel__description">{{ $t('settings.planDescription') }}</p>

        <div class="plans-grid">
          <article
              v-for="plan in SUBSCRIPTION_PLANS"
              :key="plan.code"
              :class="['plan-card', { selected: selectedPlan === plan.code }]"
              @click="selectedPlan = plan.code"
              role="radio"
              :aria-checked="selectedPlan === plan.code"
              tabindex="0"
              @keydown.enter="selectedPlan = plan.code"
              @keydown.space.prevent="selectedPlan = plan.code"
          >
            <header class="plan-card__header">
              <span class="plan-card__radio" aria-hidden="true">
                <span v-if="selectedPlan === plan.code" class="plan-card__radio-dot"></span>
              </span>
              <h3>{{ t(plan.nameKey) }}</h3>
            </header>
            <p class="plan-card__description">{{ t(plan.descriptionKey) }}</p>
            <div class="plan-card__pricing">
              <span class="plan-card__price">S/ {{ plan.monthlyPrice }}</span>
              <span class="plan-card__period">/ {{ $t('homePage.month') }}</span>
            </div>
            <div class="plan-card__meta">
              {{ plan.mealsPerDay }} {{ $t('settings.mealsPerDay') }}
            </div>
          </article>
        </div>

        <footer class="plans-panel__footer fh-card">
          <p>{{ $t('settings.selectedPlanRule', { meals: activePlan.mealsPerDay }) }}</p>
          <button class="fh-btn fh-btn--primary" type="button" :disabled="isSavingPlan" @click="savePlan">
            <i v-if="isSavingPlan" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-save"></i>
            <span>{{ $t('settings.savePlan') }}</span>
          </button>
        </footer>
      </section>

      <section v-else-if="!isLoading && activeTab === 'preferences'" key="prefs" class="prefs-panel">
        <article class="settings-card fh-card">
          <header class="settings-card__header">
            <h2>{{ $t('settings.themeLabel') }}</h2>
          </header>
          <div class="pref-row">
            <div class="pref-row__info">
              <strong>{{ theme === 'dark' ? $t('theme.dark') : $t('theme.light') }}</strong>
              <span>{{ $t('theme.toggle') }}</span>
            </div>
            <ThemeToggle />
          </div>
        </article>

        <article class="settings-card fh-card">
          <header class="settings-card__header">
            <h2>{{ $t('settings.languageLabel') }}</h2>
          </header>
          <div class="pref-row">
            <div class="pref-row__info">
              <strong>{{ $t('language.label') }}</strong>
              <span>{{ $t('language.en') }} / {{ $t('language.es') }}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </article>
      </section>
    </transition>
  </section>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-top: var(--space-6);
}

.settings-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.settings-page__header h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 700;
  color: var(--color-text);
}

.settings-page__header p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1.02rem;
}

.settings-page__alerts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert {
  margin: 0;
  display: inline-flex;
  align-items: center;
  align-self: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
}

.alert--info {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}

.alert--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.alert--error {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.settings-tabs {
  display: inline-flex;
  align-self: center;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.settings-tabs__btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  padding: 10px 22px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--duration-fast) ease,
              color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease;
}

.settings-tabs__btn:hover {
  color: var(--color-text);
}

.settings-tabs__btn.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-xs);
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: var(--space-5);
  align-items: start;
}

.settings-card {
  padding: var(--space-5) var(--space-6) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.settings-card__header h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}

.settings-grid__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.settings-grid__fields--single {
  grid-template-columns: 1fr;
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-field span {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.settings-field--wide {
  grid-column: 1 / -1;
}

.settings-card__submit {
  align-self: flex-start;
  padding: 12px 22px;
}

/* Plans */
.plans-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.plans-panel__description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1rem;
  text-align: center;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.plan-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 22px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease,
              transform var(--duration-fast) ease;
}

.plan-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.plan-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft), var(--shadow-sm);
}

.plan-card__header {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.plan-card__radio {
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border-strong);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--duration-fast) ease;
}

.plan-card.selected .plan-card__radio {
  border-color: var(--color-primary);
}

.plan-card__radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
}

.plan-card__header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
}

.plan-card__description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.45;
  flex: 1;
}

.plan-card__pricing {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.plan-card__price {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-text);
}

.plan-card__period {
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.plan-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  align-self: flex-start;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 600;
}

.plans-panel__footer {
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.plans-panel__footer p {
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
}

/* Preferences */
.prefs-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
}

.pref-row__info {
  display: flex;
  flex-direction: column;
}

.pref-row__info strong {
  font-size: 0.98rem;
  color: var(--color-text);
}

.pref-row__info span {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

@media (max-width: 960px) {
  .settings-grid,
  .plans-grid,
  .prefs-panel,
  .settings-grid__fields {
    grid-template-columns: 1fr;
  }

  .plans-panel__footer {
    flex-direction: column;
    align-items: stretch;
  }
  .plans-panel__footer .fh-btn { width: 100%; }
}
</style>
