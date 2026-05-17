<script setup>
import ToolbarComponent from '@/shared/interfaces/presentation/authenticated-toolbar.component.vue';
</script>

<template>
  <div class="fh-shell">
    <ToolbarComponent />
    <main class="fh-shell__main">
      <router-view v-slot="{ Component, route }">
        <transition name="fh-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fh-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

.fh-shell__main {
  flex: 1;
  padding-bottom: var(--space-12);
}

.fh-fade-enter-active,
.fh-fade-leave-active {
  transition: opacity var(--duration-base) ease,
              transform var(--duration-base) var(--ease-out);
}

.fh-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fh-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
