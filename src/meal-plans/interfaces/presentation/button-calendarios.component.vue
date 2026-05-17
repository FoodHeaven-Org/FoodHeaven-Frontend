<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useRouter } from 'vue-router'
const confirm = useConfirm()
const router = useRouter()

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

function confirmarAccion() {
  confirm.require({
    group: 'headless',
    message: t('calendar.confirmText1'),
    acceptLabel: t('calendar.yes'),
    rejectLabel: t('calendar.no'),
    accept: () => confirmationDone(),
    reject: () => {}
  })
}

function confirmationDone() {
  confirm.require({
    group: 'done',
    message: t('calendar.confirmText2'),
    acceptLabel: t('calendar.goHome'),
    accept: () => router.push({ name: 'Inicio' })
  })
}
</script>

<template>
  <div class="calendar-actions fh-container">
    <ConfirmDialog group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="fh-dialog">
          <div class="fh-dialog__icon">
            <i class="pi pi-question-circle"></i>
          </div>
          <p class="fh-dialog__message">{{ message.message }}</p>
          <div class="fh-dialog__actions">
            <button class="fh-btn fh-btn--ghost" type="button" @click="rejectCallback" v-if="message.rejectLabel">
              {{ message.rejectLabel }}
            </button>
            <button class="fh-btn fh-btn--primary" type="button" @click="acceptCallback">
              {{ message.acceptLabel }}
            </button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <ConfirmDialog group="done">
      <template #container="{ message, acceptCallback }">
        <div class="fh-dialog">
          <div class="fh-dialog__icon fh-dialog__icon--success">
            <i class="pi pi-check-circle"></i>
          </div>
          <p class="fh-dialog__message">{{ message.message }}</p>
          <div class="fh-dialog__actions">
            <button class="fh-btn fh-btn--primary" type="button" @click="acceptCallback">
              {{ message.acceptLabel }}
            </button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <button class="fh-btn fh-btn--primary calendar-actions__save" type="button" @click="confirmarAccion">
      <i class="pi pi-save"></i>
      {{ $t('calendar.confirmButton') }}
    </button>
  </div>
</template>

<style>
.calendar-actions {
  display: flex;
  justify-content: center;
  padding: var(--space-3) var(--space-5) var(--space-8);
}

.calendar-actions__save {
  min-width: 240px;
  padding: 14px 36px;
  font-size: 1rem;
}

.fh-dialog {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 36px 38px;
  text-align: center;
  max-width: 460px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.fh-dialog__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.fh-dialog__icon--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.fh-dialog__message {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.fh-dialog__actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.fh-dialog__actions .fh-btn {
  min-width: 120px;
}
</style>
