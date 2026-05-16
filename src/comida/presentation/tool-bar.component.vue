<template>
  <div class="toolbar-container">
    <Toolbar class="custom-toolbar">
      
      <template #start>
        <div class="logo-section">
          <img src="https://i.imgur.com/r5tfrlF.png" alt="Logo" class="logo" />
          <span class="logo-text">
            <span class="text-green">Food</span><span class="text-black">Heaven</span>
          </span>
        </div>
      </template>

      
      <template #center>
        <div class="nav-links">
          
          <Button :label="$t('toolbar.home')" text class="nav-button" @click="goTo('inicio')" />
          <Button :label="$t('toolbar.calendar')" text class="nav-button" @click="goTo('calendario')" />
          <Button :label="$t('toolbar.account')" text class="nav-button" @click="goTo('cuenta')" />
        </div>
      </template>

      
      <template #end>
        <div class="end-toolbar">
          <Language />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Language from './language-switcher,component.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();

function goTo(page) {
  router.push(`/foodheaven/${page}`);
}
</script>

<style scoped>
.toolbar-container {
  background-color: #2e7d32;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 15px;
}

.custom-toolbar {
  background-color: #ffffff;
  border-radius: 25px;
  width: 100%;
  padding: 1px; /* 🔧 antes: 0.5rem 2rem */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-text {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.text-green {
  color: #4CAF50;
}

.text-black {
  color: #000000;
}

.nav-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex: 1;
}

.nav-button {
  font-weight: normal;
  color: #000000;
  background-color: transparent;
  font-size: 18px;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-button:hover {
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}

.end-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
