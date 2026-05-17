<script setup>
import { useI18n } from 'vue-i18n';
import { computed, watch } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'pill',
    validator: (value) => ['pill', 'compact'].includes(value)
  }
});

const { locale } = useI18n();
const STORAGE_KEY = 'foodheaven.locale';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' }
];

const currentLocale = computed(() => locale.value);

watch(currentLocale, (next) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', next);
  }
});

function setLanguage(lang) {
  locale.value = lang;
}
</script>

<template>
  <div class="lang-switcher" :class="`lang-switcher--${props.variant}`" role="group" aria-label="Language selector">
    <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        :class="['lang-btn', { active: currentLocale === lang.code }]"
        :aria-pressed="currentLocale === lang.code"
        :title="lang.name"
        @click="setLanguage(lang.code)"
    >
      <span>{{ lang.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}

.lang-switcher--compact {
  padding: 3px;
}

.lang-btn {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  transition: background var(--duration-fast) ease,
              color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease;
}

.lang-switcher--compact .lang-btn {
  padding: 4px 10px;
  font-size: 0.72rem;
}

.lang-btn:hover {
  color: var(--color-text);
}

.lang-btn.active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-xs);
}
</style>
