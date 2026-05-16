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

const isLoading = ref(true)
const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const isSavingPlan = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const tabs = [
  { key: 'profile', labelKey: 'settings.personalTitle' },
  { key: 'plan', labelKey: 'settings.changePlanTitle' },
  { key: 'security', labelKey: 'settings.passwordTitle' }
]
const requestedTab = String(route.query.tab ?? 'profile')
const activeTab = ref(tabs.some(tab => tab.key === requestedTab) ? requestedTab : 'profile')

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

onBeforeMount(async () => {
  await loadProfile()
})

async function loadProfile() {
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

watch(() => route.query.tab, (tab) => {
  const nextTab = String(tab ?? 'profile')
  activeTab.value = tabs.some(item => item.key === nextTab) ? nextTab : 'profile'
})
</script>

<template>
  <section class="settings-page">
    <h1>{{ $t('settings.title') }}</h1>
    <p class="subtitle">{{ $t('settings.subtitle') }}</p>

    <p v-if="isLoading" class="status-message">{{ $t('settings.loading') }}</p>
    <p v-if="statusMessage" class="success-message">{{ statusMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="!isLoading" class="settings-tabs">
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

    <div v-if="!isLoading" class="settings-grid">
      <form v-if="activeTab === 'profile'" class="settings-card single-card" @submit.prevent="saveProfile">
        <h2>{{ $t('settings.personalTitle') }}</h2>
        <label for="fullName">{{ $t('account.name') }}</label>
        <input id="fullName" v-model="profileForm.fullName" type="text" />

        <label for="username">{{ $t('account.email') }}</label>
        <input id="username" v-model="profileForm.username" type="email" />

        <label for="phone">{{ $t('account.phone') }}</label>
        <input id="phone" v-model="profileForm.phone" type="tel" />

        <label for="city">{{ $t('account.city') }}</label>
        <input id="city" v-model="profileForm.city" type="text" />

        <label for="address">{{ $t('account.address') }}</label>
        <input id="address" v-model="profileForm.address" type="text" />

        <label for="paymentMethod">{{ $t('account.paymentMethod') }}</label>
        <select id="paymentMethod" v-model="profileForm.paymentMethod">
          <option value="Card">{{ $t('settings.paymentCard') }}</option>
          <option value="Yape">{{ $t('settings.paymentYape') }}</option>
          <option value="Cash">{{ $t('settings.paymentCash') }}</option>
        </select>

        <button type="submit" :disabled="isSavingProfile">{{ $t('settings.saveProfile') }}</button>
      </form>

      <form v-if="activeTab === 'security'" class="settings-card single-card" @submit.prevent="savePassword">
        <h2>{{ $t('settings.passwordTitle') }}</h2>
        <label for="currentPassword">{{ $t('settings.currentPassword') }}</label>
        <input id="currentPassword" v-model="passwordForm.currentPassword" type="password" />

        <label for="newPassword">{{ $t('settings.newPassword') }}</label>
        <input id="newPassword" v-model="passwordForm.newPassword" type="password" />

        <label for="confirmPassword">{{ $t('settings.confirmPassword') }}</label>
        <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" />

        <button type="submit" :disabled="isSavingPassword">{{ $t('settings.savePassword') }}</button>
      </form>

      <article v-if="activeTab === 'plan'" class="settings-card single-card plan-card">
        <h2>{{ $t('settings.changePlanTitle') }}</h2>
        <p>{{ $t('settings.planDescription') }}</p>

        <div class="plan-options">
          <label
              v-for="plan in SUBSCRIPTION_PLANS"
              :key="plan.code"
              class="plan-option"
              :class="{ selected: selectedPlan === plan.code }"
          >
            <input v-model="selectedPlan" type="radio" name="subscriptionPlan" :value="plan.code" />
            <strong>{{ t(plan.nameKey) }}</strong>
            <span>{{ t(plan.descriptionKey) }}</span>
            <small>S/ {{ plan.monthlyPrice }} / mes</small>
          </label>
        </div>

        <p class="plan-rule">
          {{ $t('settings.selectedPlanRule', { meals: activePlan.mealsPerDay }) }}
        </p>
        <button type="button" :disabled="isSavingPlan" @click="savePlan">{{ $t('settings.savePlan') }}</button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.settings-page {
  color: black;
  max-width: 1000px;
  margin: 64px auto;
  padding: 0 20px;
}

h1,
.subtitle,
.status-message,
.success-message,
.error-message {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 28px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.settings-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.settings-tabs button {
  background: white;
  border: 1px solid #000;
  color: #000;
}

.settings-tabs button.active {
  background: #53C758;
  border-color: #53C758;
  color: white;
}

.settings-card {
  border: 1px solid #53C758;
  border-radius: 8px;
  padding: 24px;
}

.single-card {
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
}

.settings-card h2 {
  font-size: 1.3rem;
  margin-bottom: 18px;
}

.settings-card p {
  margin-bottom: 18px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

input,
select {
  border: 1px solid black;
  border-radius: 18px;
  font: inherit;
  margin-bottom: 16px;
  padding: 9px 14px;
  width: 100%;
}

button {
  background: #000;
  border: 1px solid #000;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 10px 20px;
}

button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.plan-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.plan-option {
  border: 1px solid #cfd8cf;
  border-radius: 8px;
  padding: 18px;
}

.plan-option input {
  width: auto;
  margin-right: 8px;
}

.plan-option strong,
.plan-option span,
.plan-option small {
  display: block;
}

.plan-option span {
  font-weight: 400;
  margin: 8px 0;
}

.plan-option.selected {
  border-color: #53C758;
  box-shadow: 0 0 0 1px #53C758;
}

.plan-rule {
  color: #2e7d32;
  font-weight: 700;
}

.success-message {
  color: #2e7d32;
  font-weight: 700;
}

.error-message {
  color: #b42318;
  font-weight: 700;
}

@media (max-width: 820px) {
  .settings-grid,
  .plan-options {
    grid-template-columns: 1fr;
  }
}
</style>
