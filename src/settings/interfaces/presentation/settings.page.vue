<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'
import {
  getSubscriptionPlan,
  SUBSCRIPTION_PLANS
} from '@/security/domain/model/valueobjects/subscription-plan.valueobject.js'

const { t } = useI18n()
const route = useRoute()
const accountApiService = new AccountApiService()

const tabs = [
  { key: 'profile', labelKey: 'settings.dataSecurityTitle' },
  { key: 'plan', labelKey: 'settings.changePlanTitle' }
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

async function saveProfile() {
  statusMessage.value = ''
  errorMessage.value = ''
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
  statusMessage.value = ''
  errorMessage.value = ''
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
  statusMessage.value = ''
  errorMessage.value = ''
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
  <section class="account-settings-page">
    <header class="page-heading">
      <h1>{{ $t('settings.title') }}</h1>
      <p>{{ $t('settings.subtitle') }}</p>
    </header>

    <p v-if="isLoading" class="status-message">{{ $t('settings.loading') }}</p>
    <p v-if="statusMessage" class="success-message">{{ statusMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="!isLoading" class="tab-list">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
      >
        {{ $t(tab.labelKey) }}
      </button>
    </div>

    <div v-if="!isLoading && activeTab === 'profile'" class="profile-panel">
      <form class="account-panel" @submit.prevent="saveProfile">
        <h2>{{ $t('settings.personalTitle') }}</h2>

        <div class="field-grid">
          <label>
            <span>{{ $t('account.name') }}</span>
            <input v-model="profileForm.fullName" type="text" />
          </label>

          <label>
            <span>{{ $t('account.email') }}</span>
            <input v-model="profileForm.username" type="email" />
          </label>

          <label>
            <span>{{ $t('account.phone') }}</span>
            <input v-model="profileForm.phone" type="tel" />
          </label>

          <label>
            <span>{{ $t('account.city') }}</span>
            <input v-model="profileForm.city" type="text" />
          </label>

          <label class="wide-field">
            <span>{{ $t('account.address') }}</span>
            <input v-model="profileForm.address" type="text" />
          </label>

          <label class="wide-field">
            <span>{{ $t('account.paymentMethod') }}</span>
            <select v-model="profileForm.paymentMethod">
              <option value="Card">{{ $t('settings.paymentCard') }}</option>
              <option value="Yape">{{ $t('settings.paymentYape') }}</option>
              <option value="Cash">{{ $t('settings.paymentCash') }}</option>
            </select>
          </label>
        </div>

        <button class="primary-action" type="submit" :disabled="isSavingProfile">
          {{ $t('settings.saveProfile') }}
        </button>
      </form>

      <form class="account-panel" @submit.prevent="savePassword">
        <h2>{{ $t('settings.passwordTitle') }}</h2>

        <label>
          <span>{{ $t('settings.currentPassword') }}</span>
          <input v-model="passwordForm.currentPassword" type="password" />
        </label>

        <label>
          <span>{{ $t('settings.newPassword') }}</span>
          <input v-model="passwordForm.newPassword" type="password" />
        </label>

        <label>
          <span>{{ $t('settings.confirmPassword') }}</span>
          <input v-model="passwordForm.confirmPassword" type="password" />
        </label>

        <button class="primary-action" type="submit" :disabled="isSavingPassword">
          {{ $t('settings.savePassword') }}
        </button>
      </form>
    </div>

    <section v-if="!isLoading && activeTab === 'plan'" class="plan-panel">
      <article
          v-for="plan in SUBSCRIPTION_PLANS"
          :key="plan.code"
          class="plan-option"
          :class="{ selected: selectedPlan === plan.code }"
      >
        <label>
          <input v-model="selectedPlan" type="radio" name="subscriptionPlan" :value="plan.code" />
          <span>{{ t(plan.nameKey) }}</span>
        </label>
        <p>{{ t(plan.descriptionKey) }}</p>
        <strong>S/ {{ plan.monthlyPrice }} / mes</strong>
      </article>

      <div class="plan-summary">
        <p>{{ $t('settings.selectedPlanRule', { meals: activePlan.mealsPerDay }) }}</p>
        <button class="primary-action" type="button" :disabled="isSavingPlan" @click="savePlan">
          {{ $t('settings.savePlan') }}
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.account-settings-page {
  color: #0f172a;
  max-width: 1080px;
  margin: 56px auto;
  padding: 0 20px 56px;
}

.page-heading {
  text-align: center;
  margin-bottom: 28px;
}

.page-heading h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
}

.page-heading p {
  margin: 0;
  font-size: 1.05rem;
}

.tab-list {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.tab-list button {
  background: white;
  border: 1px solid #111827;
  border-radius: 999px;
  color: #111827;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  min-width: 170px;
  padding: 10px 18px;
}

.tab-list button.active {
  background: #2f9e44;
  border-color: #2f9e44;
  color: white;
}

.profile-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.85fr);
  gap: 24px;
  align-items: start;
}

.account-panel,
.plan-option,
.plan-summary {
  border: 1px solid #53c758;
  border-radius: 8px;
  background: white;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  padding: 24px;
}

.account-panel h2 {
  font-size: 1.25rem;
  margin: 0 0 18px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.wide-field {
  grid-column: 1 / -1;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: 14px;
}

label span {
  display: block;
  margin-bottom: 7px;
}

input,
select {
  border: 1px solid #111827;
  border-radius: 18px;
  font: inherit;
  padding: 9px 14px;
  width: 100%;
  background: white;
}

.primary-action {
  background: #050505;
  border: 1px solid #050505;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 10px 20px;
}

.primary-action:disabled {
  cursor: wait;
  opacity: 0.65;
}

.plan-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.plan-option {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-option.selected {
  border-color: #2f9e44;
  box-shadow: 0 0 0 1px #2f9e44, 0 10px 24px rgba(15, 23, 42, 0.06);
}

.plan-option label {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0;
}

.plan-option input {
  width: auto;
}

.plan-option p,
.plan-summary p {
  margin: 0;
  line-height: 1.45;
}

.plan-summary {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.status-message,
.success-message,
.error-message {
  text-align: center;
  font-weight: 700;
}

.success-message {
  color: #2f9e44;
}

.error-message {
  color: #b42318;
}

@media (max-width: 860px) {
  .profile-panel,
  .plan-panel,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .plan-summary {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
