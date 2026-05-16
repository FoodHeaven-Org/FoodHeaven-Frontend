<template>
  <div class="login-container">
    <div class="login-content">
      <h2 class="login-title">{{ $t('login.title') }}</h2>
      <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
      <div class="social-login">
        <button class="social-button facebook">
          <img src="https://i.imgur.com/y0qN6qp.png" alt="Facebook" class="social-icon" />
        </button>
        <button class="social-button google">
          <img src="https://i.imgur.com/fdWBoqr.png" alt="Google" class="social-icon" />
        </button>
      </div>

      <div class="divider-container">
        <hr class="divider-line">
        <span class="divider-text"> {{ $t('login.or') }} </span>
        <hr class="divider-line">
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">{{ $t('login.email') }}</label>
          <input type="email" v-model="email" class="input-field" required />
        </div>

        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <div class="password-container">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" class="input-field" required minlength="6" />
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" @click="togglePasswordVisibility"></i>
          </div>
        </div>

        <button class="login-button">{{ $t('login.button') }}</button>
      </form>

      <div class="extra-links">
        <a href="#" class="forgot-password">{{ $t('login.forgot') }} <span>{{ $t('login.forgotLink') }}</span></a>
        <br>
        <!-- El siguiente enlace es para ir a la página de registro -->
        <a href="/register" class="register">
          {{ $t('login.registerText') }} <span>{{ $t('login.registerLink') }}</span>
        </a>
      </div>
    </div>
    <div class="login-image"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';  // Importa useRouter
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const router = useRouter(); // Inicializa el router

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (password.value.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("Inicio de sesión exitoso.");
    router.push({ name: 'Inicio' });  // Asegúrate de que esta ruta exista
  } catch (error) {
    console.error(error);
    alert("Credenciales incorrectas o usuario no registrado.");
  }
};
</script>

<style scoped>
/* (todo el mismo CSS que ya tenías) */
.login-container {
  display: flex;
  height: 100vh;
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

.social-login {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

.social-icon {
  width: 24px;
  height: 24px;
}

.facebook {
  background-color: #1877F2;
}

.google {
  background-color: #FFFFFF;
  border: 1px solid #ddd;
}

.divider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 16px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: black;
  border: none;
}

.divider-text {
  font-size: 1rem;
  color: black;
  padding: 0 0.5rem;
}

.form-group label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 5px;
  border: 1px solid black;
  border-radius: 25px;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.login-button {
  background-color: white;
  color: black;
  padding: 5px 20px;
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

.login-button:hover{
  background: #2e7d32;
  color: white;
}

.login-image {
  flex: 1;
  background: url('https://i.imgur.com/6BeFx2n.jpeg') no-repeat center/cover;
  clip-path: circle(95% at right center);
  height: auto;
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
  font-size: 1.2rem;
  color: black;
}

.pi-eye{
  margin-top: 10px;
}
</style>
