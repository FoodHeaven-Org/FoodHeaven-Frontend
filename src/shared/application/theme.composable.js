import { ref } from 'vue';

const STORAGE_KEY = 'foodheaven.theme';
const VALID_THEMES = ['light', 'dark'];

function readInitialTheme() {
    if (typeof window === 'undefined') return 'light';

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (VALID_THEMES.includes(stored)) return stored;
    } catch (error) {
        /* ignore storage errors */
    }

    const prefersDark = window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? 'dark' : 'light';
}

function applyTheme(next) {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', next);
}

function persistTheme(next) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
        /* ignore */
    }
}

const theme = ref(readInitialTheme());
applyTheme(theme.value);

if (typeof window !== 'undefined' && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (VALID_THEMES.includes(stored)) return;
        } catch (error) {
            /* ignore */
        }
        const next = event.matches ? 'dark' : 'light';
        theme.value = next;
        applyTheme(next);
    };
    if (media.addEventListener) media.addEventListener('change', handler);
    else if (media.addListener) media.addListener(handler);
}

export function useTheme() {
    function setTheme(next) {
        if (!VALID_THEMES.includes(next)) return;
        theme.value = next;
        applyTheme(next);
        persistTheme(next);
    }

    function toggleTheme() {
        setTheme(theme.value === 'dark' ? 'light' : 'dark');
    }

    return {
        theme,
        setTheme,
        toggleTheme,
        isDark: () => theme.value === 'dark'
    };
}
