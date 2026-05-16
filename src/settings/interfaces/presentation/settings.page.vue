<script setup>
import Language from '@/shared/interfaces/presentation/language-switcher.component.vue'
</script>

<template>
  <section class="settings-page">
    <h1>{{ $t('settings.title') }}</h1>
    <p class="subtitle">{{ $t('settings.subtitle') }}</p>

    <div class="settings-grid">
      <article class="settings-card">
        <h2>{{ $t('settings.languageTitle') }}</h2>
        <p>{{ $t('settings.languageDescription') }}</p>
        <Language />
      </article>

      <article class="settings-card">
        <h2>{{ $t('settings.planTitle') }}</h2>
        <p>{{ $t('settings.planDescription') }}</p>
        <RouterLink class="settings-link" :to="{ name: 'Inicio' }">
          {{ $t('settings.editPlan') }}
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<style scoped>
.settings-page {
  color: black;
  max-width: 900px;
  margin: 64px auto;
  padding: 0 20px;
}

h1,
.subtitle {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 36px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.settings-card {
  border: 1px solid #53C758;
  border-radius: 8px;
  padding: 24px;
}

.settings-card h2 {
  font-size: 1.3rem;
  margin-bottom: 12px;
}

.settings-card p {
  margin-bottom: 20px;
}

.settings-link {
  color: white;
  background: #000;
  border-radius: 10px;
  display: inline-block;
  font-weight: 700;
  padding: 10px 20px;
  text-decoration: none;
}

@media (max-width: 720px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
