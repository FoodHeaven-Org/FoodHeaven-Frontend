<script setup>
import PvCuadro from '@/food-catalog/interfaces/presentation/Cuadro.component.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  selectedDay: { type: Number, required: true },
  mealsAvailable: { type: Number, default: 12 }
})
const emit = defineEmits(['day-selected'])

const dayLabels = computed(() => [
  t('cuadro.dia1'),
  t('cuadro.dia2'),
  t('cuadro.dia3'),
  t('cuadro.dia4'),
  t('cuadro.dia5'),
  t('cuadro.dia6'),
  t('cuadro.dia7')
])

const shortDayLabels = computed(() => [
  t('calendar.monday'),
  t('calendar.tuesday'),
  t('calendar.wednesday'),
  t('calendar.thursday'),
  t('calendar.friday'),
  t('calendar.saturday'),
  t('calendar.sunday')
])
</script>

<template>
  <section class="catalog-hero fh-container">
    <div class="catalog-hero__intro">
      <h1 class="catalog-hero__title">{{ $t('header.title') }}</h1>
      <p class="catalog-hero__lead">
        {{ $t('header.paragraph1') }}
        <strong>{{ $t('header.span') }}</strong>
        {{ $t('header.paragraph2') }}
      </p>
    </div>

    <PvCuadro :count="mealsAvailable" />
  </section>

  <section class="day-picker fh-container fh-container--narrow" aria-label="Day picker">
    <button
        v-for="(label, index) in dayLabels"
        :key="index"
        type="button"
        class="day-picker__chip"
        :class="{ activo: props.selectedDay === index }"
        :aria-pressed="props.selectedDay === index"
        @click="emit('day-selected', index)"
    >
      <span class="day-picker__short">{{ shortDayLabels[index] }}</span>
      <span class="day-picker__full">{{ label }}</span>
    </button>
  </section>
</template>

<style scoped>
.catalog-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 1fr);
  gap: var(--space-8);
  align-items: center;
  padding-block: var(--space-6) var(--space-3);
}

.catalog-hero__intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.catalog-hero__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.catalog-hero__lead {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.catalog-hero__lead strong {
  color: var(--color-primary);
  font-weight: 600;
}

.day-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  padding-block: var(--space-2) var(--space-3);
}

.day-picker__chip {
  appearance: none;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 11px 22px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.94rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background var(--duration-fast) ease,
              border-color var(--duration-fast) ease,
              color var(--duration-fast) ease,
              box-shadow var(--duration-fast) ease,
              transform var(--duration-fast) ease;
}

.day-picker__chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.day-picker__chip.activo {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-brand);
}

.day-picker__short { display: none; }

@media (max-width: 880px) {
  .catalog-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-5);
  }
}

@media (max-width: 640px) {
  .day-picker__chip {
    padding: 10px 14px;
    font-size: 0.88rem;
  }
  .day-picker__short { display: inline; }
  .day-picker__full  { display: none; }
}
</style>
