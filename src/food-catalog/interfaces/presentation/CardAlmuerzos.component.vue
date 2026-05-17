<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()
const emit = defineEmits(['select'])

const props = defineProps({
  comida: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false }
})

const displayedMeal = computed(() => props.comida.getLocalized(locale.value))
const buttonLabel = computed(() => {
  if (props.isBlocked) return t('planner.planBlocked')
  if (props.selected) return t('planner.selected')
  return t('planner.choose')
})
const buttonIcon = computed(() => {
  if (props.isBlocked) return 'pi pi-lock'
  if (props.selected) return 'pi pi-check'
  return 'pi pi-plus'
})
</script>

<template>
  <article class="meal-card" :class="{ selected, blocked: isBlocked }">
    <div class="meal-card__media">
      <img
          v-if="displayedMeal.url"
          class="meal-card__image"
          :src="displayedMeal.url"
          :alt="displayedMeal.nombre"
          loading="lazy"
      />
      <div v-else class="meal-card__image meal-card__image--placeholder">
        <i class="pi pi-image"></i>
      </div>

      <transition name="fh-fade">
        <span v-if="selected" class="meal-card__chip">
          <i class="pi pi-check-circle"></i> {{ t('planner.selected') }}
        </span>
      </transition>
    </div>

    <div class="meal-card__body">
      <h3 class="meal-card__title">{{ displayedMeal.nombre }}</h3>
      <p class="meal-card__subtitle">{{ displayedMeal.complemento }}</p>

      <dl class="meal-card__nutrition">
        <div class="meal-card__nutrient">
          <dt>{{ t('nutrition.calories') }}</dt>
          <dd>{{ displayedMeal.nutriente }}<span>kcal</span></dd>
        </div>
        <div class="meal-card__nutrient">
          <dt>{{ t('nutrition.protein') }}</dt>
          <dd>{{ displayedMeal.prote }}<span>g</span></dd>
        </div>
        <div class="meal-card__nutrient">
          <dt>{{ t('nutrition.carbs') }}</dt>
          <dd>{{ displayedMeal.carbo }}<span>g</span></dd>
        </div>
        <div class="meal-card__nutrient">
          <dt>{{ t('nutrition.fat') }}</dt>
          <dd>{{ displayedMeal.grasa }}<span>g</span></dd>
        </div>
      </dl>

      <button
          type="button"
          class="meal-card__action"
          :class="{ selected, blocked: isBlocked }"
          :disabled="isSaving"
          @click="emit('select', comida)"
      >
        <i :class="buttonIcon"></i>
        <span>{{ buttonLabel }}</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
/* The card is a CSS grid with a fixed layout: media, title, subtitle,
   nutrition box, and an action button anchored at the bottom. Heights
   are explicit so every card looks identical regardless of how long
   the meal name or description is, or what dimensions the image has. */
.meal-card {
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out),
              border-color var(--duration-base) var(--ease-out);
  height: 100%;
  position: relative;
}

.meal-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.meal-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-soft), var(--shadow-sm);
}

.meal-card.blocked {
  border-color: var(--color-danger);
  background: var(--color-danger-soft);
}

.meal-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
  background: var(--color-surface-2);
}

.meal-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out);
}

.meal-card:hover .meal-card__image {
  transform: scale(1.05);
}

.meal-card__image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-soft);
  font-size: 1.8rem;
  height: 100%;
}

.meal-card__chip {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: 0.74rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.meal-card__body {
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  gap: 10px;
  padding: 16px 18px 18px;
}

.meal-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.25;
  /* Always reserves 2 lines */
  height: 2.5em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-card__subtitle {
  margin: 0;
  font-size: 0.86rem;
  color: var(--color-text-muted);
  line-height: 1.45;
  /* Always reserves 3 lines */
  height: 3.9em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-card__nutrition {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  padding: 10px 8px;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
}

.meal-card__nutrient {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}

.meal-card__nutrient dt {
  font-size: 0.66rem;
  font-weight: 600;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
}

.meal-card__nutrient dd {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  line-height: 1.1;
}

.meal-card__nutrient dd span {
  margin-left: 2px;
  font-size: 0.62rem;
  font-weight: 500;
  color: var(--color-text-soft);
}

.meal-card__action {
  align-self: end;
  appearance: none;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background var(--duration-fast) ease,
              color var(--duration-fast) ease,
              border-color var(--duration-fast) ease;
}

.meal-card__action:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.meal-card__action.selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.meal-card__action.selected:hover {
  background: var(--color-primary-strong);
  border-color: var(--color-primary-strong);
  color: var(--color-text-inverse);
}

.meal-card__action.blocked,
.meal-card__action.blocked:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: #fff;
}

.meal-card__action:disabled {
  opacity: 0.65;
  cursor: wait;
}
</style>
