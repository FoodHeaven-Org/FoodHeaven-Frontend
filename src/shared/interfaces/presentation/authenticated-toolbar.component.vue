<template>
  <header class="fh-topbar">
    <div class="fh-topbar__band">
      <div class="fh-topbar__pill">
        <RouterLink :to="{ name: 'Inicio' }" class="fh-brand" :aria-label="$t('toolbar.title')">
          <img src="/logoFoodHeaven.png" alt="" class="fh-brand__logo" />
          <span class="fh-brand__text">
            <span class="fh-brand__text-primary">Food</span><span class="fh-brand__text-secondary">Heaven</span>
          </span>
        </RouterLink>

        <button
            type="button"
            class="fh-topbar__menu-toggle"
            :aria-label="isDrawerOpen ? $t('toolbar.closeMenu') : $t('toolbar.openMenu')"
            :aria-expanded="isDrawerOpen"
            @click="toggleDrawer"
        >
          <i :class="isDrawerOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>

        <nav class="fh-nav" :class="{ open: isDrawerOpen }" aria-label="Primary">
          <RouterLink :to="{ name: 'Inicio' }" class="fh-nav__link" @click="closeDrawer">
            {{ $t('toolbar.home') }}
          </RouterLink>
          <RouterLink :to="{ name: 'Calendario' }" class="fh-nav__link" @click="closeDrawer">
            {{ $t('toolbar.calendar') }}
          </RouterLink>
          <RouterLink :to="{ name: 'Cuenta' }" class="fh-nav__link" @click="closeDrawer">
            {{ $t('toolbar.account') }}
          </RouterLink>
          <RouterLink :to="{ name: 'Configuracion' }" class="fh-nav__link" @click="closeDrawer">
            {{ $t('toolbar.settings') }}
          </RouterLink>
        </nav>

        <div class="fh-topbar__actions">
          <ThemeToggle />
          <Language variant="compact" />
          <button type="button" class="fh-logout" @click="logout" :title="$t('toolbar.logout')">
            <i class="pi pi-sign-out"></i>
            <span class="fh-logout__label">{{ $t('toolbar.logout') }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isDrawerOpen" class="fh-topbar__backdrop" @click="closeDrawer"></div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Language from './language-switcher.component.vue';
import ThemeToggle from './theme-toggle.component.vue';
import { clearSession } from '@/security/application/internal/auth-api.service.js';

const router = useRouter();
const route = useRoute();
const isDrawerOpen = ref(false);

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}

function logout() {
  clearSession();
  router.push({ name: 'Login' });
}

watch(() => route.fullPath, closeDrawer);
</script>

<style scoped>
.fh-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
}

.fh-topbar__band {
  background: var(--color-primary);
  padding: 14px 20px;
  display: flex;
  justify-content: center;
  transition: background var(--duration-base) ease;
}

:root[data-theme='dark'] .fh-topbar__band {
  background: #1d2120;        /* matches the surfaces, no gradient, no green stroke */
  border-bottom: 1px solid var(--color-border);
}

.fh-topbar__pill {
  width: 100%;
  max-width: var(--container-max);
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  padding: 10px 14px 10px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

:root[data-theme='dark'] .fh-topbar__pill {
  background: var(--color-surface-2);
  border-color: var(--color-border-strong);
}

.fh-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  user-select: none;
  flex-shrink: 0;
}

.fh-brand__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.fh-brand__text {
  font-size: 1.3rem;
  font-weight: 700;
  display: inline-flex;
  letter-spacing: -0.01em;
}

.fh-brand__text-primary { color: var(--color-primary); }
.fh-brand__text-secondary { color: var(--color-text); }

.fh-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.fh-nav__link {
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-size: 0.96rem;
  font-weight: 500;
  color: var(--color-text);
  transition: background var(--duration-fast) ease,
              color var(--duration-fast) ease;
  white-space: nowrap;
}

.fh-nav__link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.fh-nav__link.router-link-active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: 600;
}

.fh-topbar__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.fh-logout {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.88rem;
  transition: background var(--duration-fast) ease, color var(--duration-fast) ease;
}

.fh-logout:hover {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.fh-topbar__menu-toggle {
  display: none;
  appearance: none;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.fh-topbar__backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  z-index: 10;
}

@media (max-width: 1100px) {
  .fh-nav__link { padding: 8px 12px; font-size: 0.92rem; }
  .fh-logout__label { display: none; }
}

@media (max-width: 900px) {
  .fh-topbar__band { padding: 10px 14px; }
  .fh-topbar__pill { padding: 8px 10px 8px 16px; gap: 12px; }
  .fh-brand__text { font-size: 1.15rem; }
  .fh-brand__logo { width: 32px; height: 32px; }
}

@media (max-width: 820px) {
  .fh-topbar__menu-toggle {
    display: inline-flex;
  }

  .fh-nav {
    position: fixed;
    top: calc(var(--header-height) - 4px);
    right: 14px;
    left: 14px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 4px;
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: transform var(--duration-base) ease,
                opacity var(--duration-base) ease;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    z-index: 20;
    flex: none;
  }

  .fh-nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .fh-nav__link {
    text-align: left;
    padding: 12px 16px;
    border-radius: var(--radius-md);
  }

  .fh-topbar__actions {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .fh-brand__text { font-size: 1rem; }
  .fh-brand__logo { width: 28px; height: 28px; }
}
</style>
