import { createI18n } from 'vue-i18n';
import en from '@/shared/infrastructure/i18n/en.js';
import es from '@/shared/infrastructure/i18n/es.js';

const STORAGE_KEY = 'foodheaven.locale';
const VALID_LOCALES = ['en', 'es'];

function detectInitialLocale() {
    if (typeof window === 'undefined') return 'en';

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (VALID_LOCALES.includes(stored)) return stored;
    } catch (error) {
        // ignore storage errors
    }

    const browser = (window.navigator?.language || 'en').slice(0, 2).toLowerCase();
    return VALID_LOCALES.includes(browser) ? browser : 'en';
}

const initialLocale = detectInitialLocale();

if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', initialLocale);
}

const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: 'en',
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
    messages: { en, es }
});

export default i18n;
export { VALID_LOCALES };
