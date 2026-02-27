(function initErrorScreen() {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const themeCheckbox = document.querySelector('[data-theme-toggle]');
    const langCheckbox = document.querySelector('[data-lang-toggle]');
    const translatables = document.querySelectorAll('[data-copy-fr][data-copy-en]');

    const setTheme = (theme, persist = true) => {
        const normalized = theme === 'dark' ? 'dark' : 'light';
        if (normalized === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        if (themeCheckbox) {
            themeCheckbox.checked = normalized === 'dark';
        }
        if (persist) {
            try {
                localStorage.setItem('theme', normalized);
            } catch (_) {
                /* noop */
            }
        }
    };

    const savedTheme = (() => {
        try {
            return localStorage.getItem('theme');
        } catch (_) {
            return null;
        }
    })();

    const prefersDarkMatches = prefersDark && prefersDark.matches;
    setTheme(savedTheme ? savedTheme : (prefersDarkMatches ? 'dark' : 'light'), Boolean(savedTheme));

    themeCheckbox?.addEventListener('change', (event) => {
        setTheme(event.target.checked ? 'dark' : 'light');
    });

    prefersDark?.addEventListener('change', (event) => {
        if (!savedTheme) {
            setTheme(event.matches ? 'dark' : 'light', false);
        }
    });

    const updatePaths = () => {
        const path = window.location.pathname || '/404';
        document.querySelectorAll('[data-path]').forEach((element) => {
            element.textContent = path;
        });
    };

    const applyLanguage = (lang) => {
        const normalized = lang === 'en' ? 'en' : 'fr';
        translatables.forEach((element) => {
            const html = normalized === 'en' ? element.dataset.copyEn : element.dataset.copyFr;
            if (typeof html === 'string') {
                element.innerHTML = html;
            }
        });
        root.setAttribute('lang', normalized);
        if (langCheckbox) {
            langCheckbox.checked = normalized === 'en';
        }
        try {
            localStorage.setItem('language', normalized);
        } catch (_) {
            /* noop */
        }
        updatePaths();
    };

    const savedLanguage = (() => {
        try {
            return localStorage.getItem('language');
        } catch (_) {
            return null;
        }
    })() || 'fr';

    applyLanguage(savedLanguage);

    langCheckbox?.addEventListener('change', (event) => {
        applyLanguage(event.target.checked ? 'en' : 'fr');
    });

    updatePaths();
})();
