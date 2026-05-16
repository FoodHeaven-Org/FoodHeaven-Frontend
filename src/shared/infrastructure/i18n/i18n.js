import { createI18n } from 'vue-i18n';
import en from '@/shared/infrastructure/i18n/en.js';
import es from '@/shared/infrastructure/i18n/es.js';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: { en, es }
});

export default i18n;
