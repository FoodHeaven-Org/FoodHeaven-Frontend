<script setup>
import { useTheme } from '@/shared/application/theme.composable.js';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { theme, toggleTheme } = useTheme();
const { t } = useI18n();

const isDark = computed(() => theme.value === 'dark');
const ariaLabel = computed(() => isDark.value ? t('theme.light') : t('theme.dark'));
</script>

<template>
  <button
      type="button"
      class="theme-toggle"
      :class="{ 'is-dark': isDark }"
      :aria-label="ariaLabel"
      :title="ariaLabel"
      @click="toggleTheme"
  >
    <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
      <i class="pi pi-sun"></i>
    </span>
    <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
      <i class="pi pi-moon"></i>
    </span>
    <span class="theme-toggle__thumb" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  width: 56px;
  height: 30px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface-2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background var(--duration-base) ease,
              border-color var(--duration-base) ease;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
}

.theme-toggle__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-size: 0.72rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  pointer-events: none;
}

.theme-toggle__icon i {
  display: block;
  line-height: 1;
}

.theme-toggle__icon--sun {
  left: 3px;
  color: var(--fh-yellow);
}

.theme-toggle__icon--moon {
  right: 3px;
  color: var(--color-text-soft);
}

.theme-toggle__thumb {
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: left var(--duration-base) var(--ease-out),
              background var(--duration-base) ease;
  z-index: 1;
}

.theme-toggle.is-dark .theme-toggle__thumb {
  left: calc(100% - 25px);
  background: var(--color-primary);
}

.theme-toggle.is-dark .theme-toggle__icon--sun {
  color: var(--color-text-soft);
}

.theme-toggle.is-dark .theme-toggle__icon--moon {
  color: var(--fh-yellow);
}
</style>
