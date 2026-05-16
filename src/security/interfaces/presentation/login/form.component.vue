<template>
  <div class="login-container">
    <div class="login-content">
      <h2 class="login-title">{{ $t('login.title') }}</h2>
      <p class="login-subtitle">{{ $t('login.subtitle') }}</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">{{ $t('login.email') }}</label>
          <input id="email" type="email" v-model="email" class="input-field" required />
        </div>

        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <div class="password-container">
            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" class="input-field" required minlength="6" />
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" @click="togglePasswordVisibility"></i>
          </div>
        </div>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <button class="login-button" type="submit">{{ $t('login.button') }}</button>
      </form>

      <div class="extra-links">
        <RouterLink :to="{ name: 'Register' }" class="register">
          {{ $t('login.registerText') }} <span>{{ $t('login.registerLink') }}</span>
        </RouterLink>
      </div>
    </div>
    <div class="login-image"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthApiService } from '@/security/application/internal/auth-api.service.js'

const authApiService = new AuthApiService()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const router = useRouter()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  try {
    await authApiService.login({ username: email.value, password: password.value })
    await router.push({ name: 'Inicio' })
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Invalid credentials or unavailable backend.'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 4rem;
  max-width: 700px;
  margin-left: 80px;
}

.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 8px 14px;
  border: 1px solid black;
  border-radius: 25px;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.login-button {
  background-color: white;
  color: black;
  padding: 8px 20px;
  width: 40%;
  border: 1px solid #000;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  align-self: center;
  display: block;
  margin: 1rem auto;
}

.login-button:hover {
  background: #2e7d32;
  color: white;
}

.login-image {
  flex: 1;
  background: url('https://i.imgur.com/6BeFx2n.jpeg') no-repeat center/cover;
  clip-path: circle(95% at right center);
  min-height: 100vh;
}

.extra-links {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.extra-links a {
  color: black;
  text-decoration: none;
}

.extra-links span {
  color: #53C758;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s;
}

.extra-links span:hover {
  text-decoration: underline;
}

.password-container {
  position: relative;
}

.password-container i {
  position: absolute;
  right: 15px;
  top: 12px;
  font-size: 1.2rem;
  color: black;
}

.form-error {
  color: #b42318;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 900px) {
  .login-image {
    display: none;
  }

  .login-content {
    margin-left: 0;
    max-width: 100%;
    padding: 2rem;
  }
}
</style>
