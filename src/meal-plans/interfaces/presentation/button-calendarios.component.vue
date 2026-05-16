<script setup>
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

function confirmarAccion() {
  confirm.require({
    group: 'headless',
    message: t('calendar.confirmText1'),
    acceptLabel: t('calendar.yes'),
    rejectLabel: t('calendar.no'),
    accept: () => {
      confirmationDone() // Muestra el segundo confirm dialog
    },
    reject: () => {
      console.log('Acción cancelada')
    }
  })
}

function confirmationDone() {
  confirm.require({
    group: 'done',
    message: t('calendar.confirmText2'),
    acceptLabel: t('calendar.goHome'),
    accept: () => {
      console.log('Navegar al inicio')
    }
  })
}
</script>

<template>
  <div class="flex-center">
    <ConfirmDialog group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="confirmDialog">
          <p class="mensaje">{{ message.message }}</p>
          <div class="acciones">
            <button class="aceptar" @click="acceptCallback">{{ message.acceptLabel }}</button>
            <button class="rechazar" @click="rejectCallback" v-if="message.rejectLabel">{{ message.rejectLabel }}</button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <ConfirmDialog group="done">
      <template #container="{ message, acceptCallback }">
        <div class="confirmDialog">
          <p class="mensaje">{{ message.message }}</p>
          <div class="acciones">
            <button class="rechazar" @click="acceptCallback">{{ message.acceptLabel }}</button>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <Button @click="confirmarAccion" :label="$t('calendar.confirmButton')" class="boton-verde" />
  </div>
</template>

<style>
button.boton-verde {
  margin: 0 0 10px;
  background-color: #53C758;
  color: white;
  border: none;
  width: 30%;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  font-family: Poppins;

}

button.boton-verde:hover {
  background-color: #c6f6d5 !important;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.confirmDialog {

  background-color: white;
  border-radius: 16px;
  border: 2px solid #53C758;
  padding: 30px 60px;
  text-align: center;
}

.confirmDialog .mensaje {
  font-family: Poppins;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #53C758;
}

.confirmDialog .acciones {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

button.aceptar,
button.rechazar {

  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-family: Poppins;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button.aceptar {
  background-color: white;
  color: black;
  border: 2px solid black;
}

button.aceptar:hover {
  background-color: #f0f0f0;
}

button.rechazar {
  background-color: #000000;
  color: white;
  border: 2px solid #000000;
}

button.rechazar:hover {
  background-color: #333333;
  border-color: #333333;
}
</style>