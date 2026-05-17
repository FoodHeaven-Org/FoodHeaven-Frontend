import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const STORAGE_KEY = 'foodheaven.locale';
const VALID_LOCALES = ['en', 'es'];

function readInitialLocale() {
    if (typeof window === 'undefined') return 'en';

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (VALID_LOCALES.includes(stored)) return stored;

    const navLang = (window.navigator?.language || 'en').slice(0, 2).toLowerCase();
    return VALID_LOCALES.includes(navLang) ? navLang : 'en';
}

let bootstrapped = false;

export function useLocale() {
    const i18n = useI18n();
    const { locale } = i18n;

    if (!bootstrapped) {
        bootstrapped = true;
        locale.value = readInitialLocale();
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('lang', locale.value);
        }
        watch(locale, (next) => {
            try {
                window.localStorage.setItem(STORAGE_KEY, next);
            } catch (error) {
                // ignore storage errors
            }
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('lang', next);
            }
        });
    }

    function setLocale(next) {
        if (!VALID_LOCALES.includes(next)) return;
        locale.value = next;
    }

    return {
        locale,
        setLocale,
        availableLocales: VALID_LOCALES
    };
}

export { VALID_LOCALES };
