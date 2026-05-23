<script setup>
import Calendario from "./calendario.component.vue"
import Boton from "./button-calendarios.component.vue"
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const calendarRef = ref(null)

async function saveCalendarPlan() {
  await calendarRef.value?.saveDeliverySchedules()
}
</script>

<template>
  <section class="calendar-page">
    <header class="calendar-page__header fh-container fh-container--narrow">
      <h1 class="calendar-page__title">{{ t('calendar.title') }}</h1>
      <p class="calendar-page__subtitle">{{ t('calendar.subtitle') }}</p>
      <p class="calendar-page__policy">
        {{ t('calendar.policyNote') }}
      </p>
    </header>

    <Calendario ref="calendarRef" />
    <Boton :save-action="saveCalendarPlan" />
  </section>
</template>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding-top: var(--space-8);
}

.calendar-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
}

.calendar-page__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.calendar-page__subtitle {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-muted);
}

.calendar-page__policy {
  margin: var(--space-3) 0 0;
  padding: 14px 18px;
  background: var(--color-primary-soft);
  border-radius: var(--radius-md);
  color: var(--color-primary-strong);
  font-size: 0.92rem;
  font-weight: 500;
  text-align: left;
  line-height: 1.55;
  max-width: 760px;
}

:root[data-theme='dark'] .calendar-page__policy {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
}
</style>
