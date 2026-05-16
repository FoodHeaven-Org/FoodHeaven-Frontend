import './assets/main.css';
import './firebase.js'; 

import 'primeicons/primeicons.css';
import i18n from './component/i18n.js';
import { createApp } from 'vue';
import App from './App.vue';
import router from './routes.js';
import PrimeVue from 'primevue/config';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import {
    Card,
    Column,
    ColumnGroup,
    ConfirmationService,
    ConfirmDialog,
    DataTable,
    IconField,
    InputIcon,
    InputText,
    Row, SplitButton
} from "primevue";
// Uso de componentes importantes:
const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(i18n);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Button', Button);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toolbar', Toolbar);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputText', InputText);
app.component('SplitButton', SplitButton);
app.component('Card', Card);

app.mount('#app');
