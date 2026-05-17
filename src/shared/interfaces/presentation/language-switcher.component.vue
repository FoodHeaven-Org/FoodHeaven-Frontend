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
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-surface) 72%, transparent);
  transition: border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease;
}

.lang-switcher:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.lang-switcher--compact {
  padding: 3px;
}

.lang-btn {
  position: relative;
  appearance: none;
  border: 1px solid transparent;
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
              border-color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease,
              transform var(--duration-fast) var(--ease-out);
}

.lang-switcher--compact .lang-btn {
  padding: 4px 10px;
  font-size: 0.72rem;
}

.lang-btn:hover {
  color: var(--color-text);
  transform: translateY(-1px);
}

.lang-btn.active {
  background: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary-strong) 70%, white);
  color: var(--color-text-inverse);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-primary) 28%, transparent);
  animation: lang-pop 180ms var(--ease-out);
  transform: translateY(0);
}

@keyframes lang-pop {
  0% { transform: scale(0.94); }
  100% { transform: scale(1); }
}
</style>
