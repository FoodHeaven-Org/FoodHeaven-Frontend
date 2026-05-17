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
const isSpanish = computed(() => currentLocale.value === 'es');

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
  <div
      class="lang-toggle"
      :class="[`lang-toggle--${props.variant}`, { 'is-es': isSpanish }]"
      role="group"
      aria-label="Language selector"
  >
    <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        class="lang-toggle__option"
        :class="{ active: currentLocale === lang.code }"
        :aria-pressed="currentLocale === lang.code"
        :title="lang.name"
        @click="setLanguage(lang.code)"
    >
      {{ lang.label }}
    </button>
    <span class="lang-toggle__thumb" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.lang-toggle {
  position: relative;
  width: 76px;
  height: 30px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface-2);
  cursor: pointer;
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  padding: 0 3px;
  transition: background var(--duration-base) ease,
              border-color var(--duration-base) ease,
              box-shadow var(--duration-fast) ease;
}

.lang-toggle:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.lang-toggle--compact {
  width: 66px;
  height: 28px;
}

.lang-toggle__option {
  position: relative;
  z-index: 2;
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--color-text-soft);
  cursor: pointer;
  height: 24px;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color var(--duration-fast) ease,
              transform var(--duration-fast) var(--ease-out);
}

.lang-toggle--compact .lang-toggle__option {
  font-size: 0.68rem;
}

.lang-toggle__option:hover {
  transform: translateY(-1px);
}

.lang-toggle__option.active {
  color: var(--color-text-inverse);
  transform: translateY(0);
}

.lang-toggle__thumb {
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  width: calc(50% - 3px);
  height: 22px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transition: left var(--duration-base) var(--ease-out),
              background var(--duration-base) ease;
  z-index: 1;
}

.lang-toggle.is-es .lang-toggle__thumb {
  left: calc(50%);
}

.lang-toggle--compact .lang-toggle__thumb {
  height: 20px;
}
</style>
