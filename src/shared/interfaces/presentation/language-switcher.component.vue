<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { locale } = useI18n();
const languages = ['en', 'es'];
const currentLocale = computed(() => locale.value);

function setLanguage(lang) {
  locale.value = lang;
}
</script>

<template>
  <div class="selector">
    <button
        v-for="lang in languages"
        :key="lang"
        :class="['lang-btn', { active: currentLocale === lang }]"
        @click="setLanguage(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.selector {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.lang-btn {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  background-color: white;
  color: #000;
  text-transform: uppercase;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid #000;
}

.lang-btn.active {
  background-color: #4CAF50;
  color: #fff;
}
</style>
