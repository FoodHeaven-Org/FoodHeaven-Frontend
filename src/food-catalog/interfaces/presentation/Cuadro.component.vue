<script setup>
defineProps({
  count: { type: Number, default: 12 }
})
</script>

<template>
  <article class="meal-summary">
    <div class="meal-summary__top">
      <h2 class="meal-summary__title">{{ $t('cuadro.title') }}</h2>
      <span class="meal-summary__count">{{ count }}</span>
    </div>
    <p class="meal-summary__text">{{ $t('cuadro.text') }}</p>
  </article>
</template>

<style scoped>
.meal-summary {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-xs);
}

.meal-summary__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.meal-summary__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
}

.meal-summary__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: 0.95rem;
  font-weight: 700;
}

.meal-summary__text {
  margin: 0;
  font-size: 0.93rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

@media (max-width: 880px) {
  .meal-summary {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
