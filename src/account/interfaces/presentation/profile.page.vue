<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { AccountApiService } from '@/account/application/internal/account-api.service.js'

const accountApiService = new AccountApiService()
const profile = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const displayName = computed(() => {
  const username = profile.value?.username ?? ''
  return username.includes('@') ? username.split('@')[0] : username
})

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
</script>

<template>
  <section class="profile-page">
    <h2 v-if="profile">{{ $t('welcome') }} {{ displayName }}</h2>
    <h2 v-else>{{ $t('welcome') }}</h2>

    <p v-if="isLoading" class="status-message">Loading account...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <template v-else-if="profile">
      <div class="buttons">
        <Button class="yellow" :label="profile.subscription" />
        <Button class="cyan" :label="$t('plan.change')" />
      </div>

      <div class="image-panel">
        <img src="https://elcomercio.pe/resizer/sXMn7piSRKXKUXgRptFvs-wfhk8=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/KYL5BYZB6ZELTMJ45HCDBS4VII.jpg" alt="Prepared meal" />
        <a class="green">Active local subscription</a>
      </div>

      <div class="personal-data">
        <p>{{ $t('account.email') }}</p>
        <a>{{ profile.username }}</a>
        <p>{{ $t('account.phone') }}</p>
        <a>{{ formatPhone(profile.phone) }}</a>
        <p>{{ $t('account.city') }}</p>
        <a>{{ profile.city }}</a>
        <p>Subscription</p>
        <a>{{ profile.subscription }}</a>
        <Button class="config" :label="$t('account.config')" />
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

img {
  height: 10rem;
  width: 10rem;
  border-radius: 100px;
  object-fit: cover;
}

.image-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  user-select: none;
}

.green {
  background: #53C758;
  padding: 8px 4rem;
  border-radius: 10px;
}

.image-panel a {
  margin-top: 10px;
  color: #ffff;
  font-family: Poppins, sans-serif;
  font-weight: bold;
}

.personal-data {
  max-width: 25rem;
  display: flex;
  flex-direction: column;
  font-family: Poppins, sans-serif;
  margin: 0 auto;
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
  margin: 2rem auto;
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

  .green {
    width: 100%;
    max-width: 25rem;
    text-align: center;
    padding: 8px 1rem;
  }
}
</style>
