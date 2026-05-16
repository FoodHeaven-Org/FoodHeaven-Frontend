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

const subscriptionLabel = computed(() => profile.value
    ? `${t(subscriptionPlan.value.nameKey)} - S/ ${subscriptionPlan.value.monthlyPrice}`
    : '')

onBeforeMount(async () => {
  try {
    profile.value = await accountApiService.getCurrentProfile()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to load your account. Please sign in again.'
  } finally {
    isLoading.value = false
  }
})

function formatPhone(phone) {
  return phone ? `+${phone}` : 'Not provided'
}

function goToSettings() {
  router.push({ name: 'Configuracion' })
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
</script>

<template>
  <section class="profile-page">
    <h2 v-if="profile">{{ $t('welcome') }} {{ displayName }}</h2>
    <h2 v-else>{{ $t('welcome') }}</h2>

    <p v-if="isLoading" class="status-message">Loading account...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <template v-else-if="profile">
      <div class="buttons">
        <Button class="yellow" :label="subscriptionLabel" />
        <Button class="cyan" :label="$t('plan.change')" @click="goToSettings" />
      </div>

      <div class="personal-data">
        <p>{{ $t('account.name') }}</p>
        <a>{{ displayName }}</a>
        <p>{{ $t('account.email') }}</p>
        <a>{{ profile.username }}</a>
        <p>{{ $t('account.phone') }}</p>
        <a>{{ formatPhone(profile.phone) }}</a>
        <p>{{ $t('account.city') }}</p>
        <a>{{ profile.city }}</a>
        <p>{{ $t('account.subscription') }}</p>
        <a>{{ subscriptionLabel }}</a>
        <Button class="config" :label="$t('account.config')" @click="goToSettings" />
        <Button class="delete" :disabled="isDeleting" :label="$t('account.delete')" @click="deleteAccount" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.profile-page {
  padding: 2rem 1rem;
}

h2 {
  font-family: Poppins, sans-serif;
  text-align: center;
  margin-top: 2rem;
}

Button {
  border-radius: 10px;
  font-family: Poppins, sans-serif;
  color: #ffff;
  font-weight: bold;
  user-select: none;
}

.yellow {
  background: #ffc107;
  padding: 8px 4rem;
}

.cyan {
  background: #6BAFCF;
  padding: 10px 2.7rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.personal-data {
  max-width: 25rem;
  display: flex;
  flex-direction: column;
  font-family: Poppins, sans-serif;
  margin: 2rem auto 0;
  user-select: none;
}

.personal-data a {
  text-align: center;
  border-radius: 20px;
  width: 100%;
  padding: 10px 0;
  border: 1px solid #53C758;
}

.config {
  background: #000000;
  padding: 10px;
  margin: 2rem auto 0;
}

.delete {
  background: #b42318;
  padding: 10px;
  margin: 1rem auto 2rem;
}

.status-message,
.error-message {
  text-align: center;
  font-weight: 600;
}

.error-message {
  color: #b42318;
}

@media (max-width: 680px) {
  .buttons {
    flex-direction: column;
    align-items: center;
  }

}
</style>
