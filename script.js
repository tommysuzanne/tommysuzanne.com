/**
 * Tommy Suzanne - Minimal Terminal Website
 * JavaScript for interactivity and quote generation
 */

const isDevMode = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: () => {}, addListener: () => {} };
let shouldReduceMotion = Boolean(prefersReducedMotion.matches);
let timelineInstance = null;
const fallbackQuote = Object.freeze([{ text: 'Aurora construit l’âge d’or.', author: 'Tommy Suzanne' }]);

const handleMotionChange = (event) => {
    shouldReduceMotion = Boolean(event.matches);
    if (shouldReduceMotion && timelineInstance) {
        timelineInstance.stopAutoplay();
    }
};

if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleMotionChange);
} else if (typeof prefersReducedMotion.addListener === 'function') {
    // Safari fallback
    prefersReducedMotion.addListener(handleMotionChange);
}

const scheduleIdle = (callback, timeout = 200) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout });
    } else {
        setTimeout(callback, timeout);
    }
};


// Theme Management with iOS Switch
// DEFAULT: Follows system preference (auto dark/light mode)
class ThemeManager {
    constructor() {
        // Check saved preference, otherwise follow system preference automatically
        const saved = localStorage.getItem('theme');
        this.theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        // Apply theme immediately to prevent flash
        if (this.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        this.init();
    }

    init() {
        // Get the main theme checkbox
        this.themeCheckboxes = Array.from(document.querySelectorAll('[data-theme-toggle]'));
        
        // Apply saved theme or system preference
        this.apply();
        // Sync checkboxes
        this.themeCheckboxes.forEach(cb => cb && (cb.checked = this.theme === 'dark'));

        // Listen for checkbox changes
        this.themeCheckboxes.forEach(cb => {
            if (!cb) return;
            cb.addEventListener('change', (e) => {
                this.theme = e.target.checked ? 'dark' : 'light';
                this.apply();
                this.save();
                // Sync all checkboxes without re-triggering events
                this.themeCheckboxes.forEach(other => { if (other !== cb) other.checked = cb.checked; });
            });
        });

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.apply();
                this.themeCheckboxes.forEach(cb => cb && (cb.checked = this.theme === 'dark'));
            }
        });
    }

    toggle() {
        const themeCheckbox = document.getElementById('theme-checkbox');
        if (themeCheckbox) {
            themeCheckbox.checked = !themeCheckbox.checked;
            themeCheckbox.dispatchEvent(new Event('change'));
        }
    }

    apply() {
        const root = document.documentElement;
        if (this.theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            this.updateThemeColor('#000000');
        } else {
            root.removeAttribute('data-theme');
            this.updateThemeColor('#f5f5f7');
        }
    }

    save() {
        localStorage.setItem('theme', this.theme);
    }

    updateThemeColor(color) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', color);
    }
}

// Quote Generator - Bilingual Version
class QuoteGenerator {
    constructor() {
        this.currentIndex = -1;
        this.usedIndices = new Set();
    }

    getQuotes() {
        // Get quotes based on current language
        const lang = languageManager ? languageManager.getCurrentLang() : 'en';
        const data = (typeof window !== 'undefined' && window.quotesData) || {};
        const langQuotes = data[lang] || data.en;
        return Array.isArray(langQuotes) && langQuotes.length ? langQuotes : fallbackQuote;
    }

    pickRandomIndex() {
        const quotes = this.getQuotes();
        if (quotes.length === 0) return -1;

        // If all quotes have been shown, reset
        if (this.usedIndices.size >= quotes.length) {
            this.usedIndices.clear();
        }

        let index;
        let guard = 0;
        do {
            index = Math.floor(Math.random() * quotes.length);
            guard++;
            if (guard > 10 * quotes.length) break; // safety
        } while (this.usedIndices.has(index) && this.usedIndices.size < quotes.length);

        this.usedIndices.add(index);
        return index;
    }

    render(index) {
        const quotes = this.getQuotes();
        const quote = quotes[index] || quotes[0];
        if (quote == null) return;

        const quoteElement = document.getElementById('quote');
        if (!quoteElement) return;

        // Fade out/in effect (respect reduced motion)
        const updateQuote = () => {
            quoteElement.textContent = `"${quote.text}"`;
            if (quote.author) {
                quoteElement.textContent += ` — ${quote.author}`;
            }
        };

        if (shouldReduceMotion) {
            updateQuote();
            return;
        }

        quoteElement.style.opacity = '0';
        setTimeout(() => {
            updateQuote();
            quoteElement.style.opacity = '1';
        }, 300);
    }

    displayRandom() {
        const idx = this.pickRandomIndex();
        if (idx >= 0) {
            this.currentIndex = idx;
            this.render(idx);
        }
    }

    displayCurrentOrRandom() {
        // Used on language toggle to show the same quote index in the new language
        const quotes = this.getQuotes();
        if (this.currentIndex >= 0 && this.currentIndex < quotes.length) {
            this.render(this.currentIndex);
        } else {
            this.displayRandom();
        }
    }
}
// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const pageLoadTime = perfData.loadEventEnd > 0 ? 
                        perfData.loadEventEnd - perfData.navigationStart : 0;
                    const connectTime = perfData.responseEnd - perfData.requestStart;
                    const renderTime = perfData.domComplete - perfData.domLoading;

                    // Only log if we have valid values
                    if (pageLoadTime > 0) {
                        // Performance metrics available
                        // Page Load: ${pageLoadTime}ms, Connect: ${connectTime}ms, Render: ${renderTime}ms

                        // Send to analytics if needed
                        this.reportMetrics({
                            pageLoadTime,
                            connectTime,
                            renderTime
                        });
                    }
                }, 100); // Small delay to ensure loadEventEnd is set
            });
        }
    }

    reportMetrics(metrics) {
        // Placeholder for analytics integration
        // Could send to Google Analytics, Plausible, etc.
        if (window.gtag) {
            window.gtag('event', 'page_load', {
                'event_category': 'Performance',
                'value': metrics.pageLoadTime
            });
        }
    }
}

// Smooth Scroll for Anchor Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#') {
                    return;
                }

                e.preventDefault();

                let target;
                try {
                    target = document.querySelector(href);
                } catch (_) {
                    target = null;
                }

                if (target) {
                    document.querySelectorAll('.terminal').forEach((terminal) => {
                        terminal.scrollTop = 0;
                        terminal.scrollLeft = 0;
                    });

                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
                    const top = target.getBoundingClientRect().top + window.scrollY;

                    try {
                        history.pushState(null, '', href);
                    } catch (_) {
                        // ignore
                    }

                    window.scrollTo({ top, left: 0, behavior });
                }
            });
        });
    }
}

// Initialize Quote Generator
const quoteGenerator = new QuoteGenerator();

// Exposed function for quote actions (keyboard shortcut, UI buttons)
function generateQuote() {
    quoteGenerator.displayRandom();
}

function formatBlogDates(lang) {
    if (typeof document === 'undefined') {
        return;
    }

    const timeEls = document.querySelectorAll('time[data-blog-date][datetime]');
    if (!timeEls.length) {
        return;
    }

    const locale = lang === 'en' ? 'en-GB' : 'fr-FR';

    let formatter;
    try {
        formatter = new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC'
        });
    } catch (_) {
        formatter = null;
    }

    timeEls.forEach((timeEl) => {
        const iso = timeEl.getAttribute('datetime');
        if (!iso) {
            return;
        }

        if (!formatter) {
            timeEl.textContent = iso;
            return;
        }

        const date = new Date(`${iso}T00:00:00Z`);
        if (Number.isNaN(date.getTime())) {
            timeEl.textContent = iso;
            return;
        }

        timeEl.textContent = formatter.format(date);
    });
}

const BLOG_POSTS = Object.freeze([
    {
        id: 'transmuter',
        fr: { path: '/blog/transmuter-l-energie-sexuelle.html', title: 'Transmuter l’énergie sexuelle au service de vos buts' },
        en: { path: '/en/blog/transmuter-l-energie-sexuelle.html', title: 'Transmute Sexual Energy in Service of Your Goals' }
    },
    {
        id: 'mission',
        fr: { path: '/blog/decouvrir-sa-mission.html', title: 'Découvrir sa mission : écrire son histoire et nommer l’essentiel' },
        en: { path: '/en/blog/discover-your-mission.html', title: 'Discover Your Mission: Write Your Story and Name the Essential' }
    },
    {
        id: 'manifest',
        fr: { path: '/blog/le-secret-pour-manifester-tous-vos-desirs.html', title: 'Manifester ses désirs : de l’intention à la réalité' },
        en: { path: '/en/blog/le-secret-pour-manifester-tous-vos-desirs.html', title: 'Manifest Your Desires: From Intention to Reality' }
    },
    {
        id: 'quantum',
        fr: { path: '/blog/acceleration-quantique.html', title: 'Accélération quantique : puiser l’énergie‑source et avancer chaque jour' },
        en: { path: '/en/blog/quantum-acceleration.html', title: 'Quantum Acceleration: Tap Source Energy and Move Forward Every Day' }
    }
]);

const normalizePathForMatch = (rawPath) => {
    if (!rawPath || typeof rawPath !== 'string') {
        return '';
    }
    const withoutQuery = rawPath.split('?')[0].split('#')[0];
    const noIndex = withoutQuery.replace(/index\.html$/i, '');
    const noHtml = noIndex.replace(/\.html$/i, '');
    const trimmed = noHtml.endsWith('/') ? noHtml.slice(0, -1) : noHtml;
    return trimmed || '/';
};

const getPathBasenameForMatch = (rawPath) => {
    const normalized = normalizePathForMatch(rawPath);
    const parts = normalized.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
};

function renderBlogPager() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const navs = Array.from(document.querySelectorAll('[data-blog-pager]'));
    if (!navs.length) {
        return;
    }

    const docLang = (document.documentElement.getAttribute('lang') || 'fr').toLowerCase();
    const lang = docLang.startsWith('en') ? 'en' : 'fr';
    const current = normalizePathForMatch(window.location.pathname);
    const currentBase = getPathBasenameForMatch(window.location.pathname);

    const currentIndex = BLOG_POSTS.findIndex((post) => {
        const postPath = post?.[lang]?.path;
        if (!postPath) {
            return false;
        }
        return normalizePathForMatch(postPath) === current || getPathBasenameForMatch(postPath) === currentBase;
    });
    if (currentIndex === -1) {
        return;
    }

    const newer = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
    const older = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

    const labels = lang === 'en'
        ? { newer: 'Newer', older: 'Older' }
        : { newer: 'Plus récent', older: 'Plus ancien' };

    const buildLink = ({ kind, post }) => {
        if (!post) {
            return null;
        }
        const meta = post[lang];
        if (!meta?.path || !meta?.title) {
            return null;
        }

        const filename = meta.path.split('/').filter(Boolean).pop();
        if (!filename) {
            return null;
        }

        const a = document.createElement('a');
        a.className = `post-nav-link post-nav-link--${kind}`;
        a.setAttribute('href', filename);
        a.rel = kind === 'newer' ? 'prev' : 'next';

        const label = document.createElement('span');
        label.className = 'post-nav-label';
        label.textContent = kind === 'newer' ? `← ${labels.newer}` : `${labels.older} →`;

        const title = document.createElement('span');
        title.className = 'post-nav-title';
        title.textContent = meta.title;

        a.appendChild(label);
        a.appendChild(title);
        return a;
    };

    navs.forEach((nav) => {
        nav.innerHTML = '';
        const newerLink = buildLink({ kind: 'newer', post: newer });
        const olderLink = buildLink({ kind: 'older', post: older });
        if (newerLink) nav.appendChild(newerLink);
        if (olderLink) nav.appendChild(olderLink);

        const hasLinks = Boolean(newerLink || olderLink);
        nav.hidden = !hasLinks;
        const prev = nav.previousElementSibling;
        const next = nav.nextElementSibling;
        [prev, next].forEach((el) => {
            if (!el || !(el instanceof HTMLElement)) {
                return;
            }
            if (el.classList.contains('post-divider')) {
                el.hidden = !hasLinks;
            }
        });
    });
}

// Language Manager
// DEFAULT: French (fr) - The site is in French by default
class LanguageManager {
    constructor() {
        // Default language is French ('fr') if not saved
        const docLang = (typeof document !== 'undefined' && document.documentElement.getAttribute('lang')) || 'fr';
        const preferredLang = docLang && docLang.toLowerCase().startsWith('en') ? 'en' : 'fr';
        this.currentLang = localStorage.getItem('language') || preferredLang;
        this.isInitializing = true;
        this.init();
    }

    init() {
        // Apply saved language
        this.applyLanguage();
        
        // Listen for new language switch
        this.langCheckboxes = Array.from(document.querySelectorAll('[data-lang-toggle]'));
        this.langCheckboxes.forEach(cb => cb && (cb.checked = this.currentLang === 'en'));
        this.langCheckboxes.forEach(cb => {
            if (!cb) return;
            cb.addEventListener('change', (e) => {
                this.currentLang = e.target.checked ? 'en' : 'fr';
                this.applyLanguage();
                this.save();
                // Sync both checkboxes without dispatching events
                this.langCheckboxes.forEach(other => { if (other !== cb) other.checked = cb.checked; });
                // Re-render the current quote at the same index in the new language
                quoteGenerator.displayCurrentOrRandom();
            });
        });

        this.isInitializing = false;
    }

    toggle() {
        this.currentLang = this.currentLang === 'en' ? 'fr' : 'en';
        this.langCheckboxes.forEach(cb => { if (cb) cb.checked = this.currentLang === 'en'; });
        this.applyLanguage();
        this.save();
        quoteGenerator.displayCurrentOrRandom();
    }

    applyLanguage() {
        // Update all elements with data-en and data-fr attributes
        document.querySelectorAll('[data-en][data-fr]').forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                // Handle both text content and HTML content
                if (element.tagName === 'H3' || text.includes('<br>')) {
                    // For headings that might contain <br> tags - safe HTML content
                    element.innerHTML = text; // Safe: only internal content, no user input
                } else if (element.children.length === 0 || element.classList.contains('motto')) {
                    // For elements without children or motto (which has —)
                    element.innerHTML = text.replace('—', '—<br>'); // Safe: only internal content
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update bilingual links (href + label) if provided
        document.querySelectorAll('a[data-href-en][data-href-fr]').forEach(a => {
            const href = a.getAttribute(`data-href-${this.currentLang}`);
            if (href) a.setAttribute('href', href);
            const label = a.getAttribute(`data-${this.currentLang}`);
            if (label) a.textContent = label;
        });

        // Update page title
        const computedTitle = 'Tommy Suzanne';
        document.title = computedTitle;

	        // Update meta description
		        const metaDesc = document.querySelector('meta[name="description"]');
		        if (metaDesc) {
		            metaDesc.content = this.currentLang === 'fr'
		                ? 'Entredonneur • Je contribue à édifier une œuvre qui me transcende.'
		                : 'Entredonneur • I contribute to building a work that transcends me.';
		        }

        // Sync Open Graph tags with current language
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogTitle) ogTitle.setAttribute('content', computedTitle);
        if (ogDesc && metaDesc) ogDesc.setAttribute('content', metaDesc.content);
        if (ogLocale) ogLocale.setAttribute('content', this.currentLang === 'fr' ? 'fr_FR' : 'en_US');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', window.location.href);

        // Sync Twitter tags with current language
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        const twUrl  = document.querySelector('meta[name="twitter:url"]');
        if (twTitle) twTitle.setAttribute('content', computedTitle);
        if (twDesc && metaDesc) twDesc.setAttribute('content', metaDesc.content);
        if (twUrl)  twUrl.setAttribute('content', window.location.href);

        formatBlogDates(this.currentLang);

        this.maybeRedirect();
    }

    save() {
        localStorage.setItem('language', this.currentLang);
    }

    getCurrentLang() {
        return this.currentLang;
    }

    maybeRedirect() {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }
        const docEl = document.documentElement;
        if (!docEl || !docEl.dataset) {
            return;
        }
        const docLang = (docEl.getAttribute('lang') || 'fr').toLowerCase();
        const pageLang = docLang.startsWith('en') ? 'en' : 'fr';
        const targetKey = this.currentLang === 'en' ? 'langEn' : 'langFr';
        const targetPath = docEl.dataset[targetKey];
        if (!targetPath) {
            return;
        }

        const resolvePath = (path) => {
            try {
                return new URL(path, window.location.href).pathname;
            } catch (_) {
                return path || '/';
            }
        };

        const normalize = (path) => {
            const resolved = resolvePath(path).replace(/index\.html$/i, '');
            return resolved.endsWith('/') ? (resolved.slice(0, -1) || '/') : resolved;
        };

        const currentPath = normalize(window.location.pathname);
        const desiredPath = normalize(targetPath);
        if (currentPath === desiredPath) {
            return;
        }

        if (this.isInitializing && this.currentLang === pageLang) {
            return;
        }

        try {
            const nextUrl = new URL(targetPath, window.location.href);
            window.location.href = nextUrl.toString();
        } catch (_) {
            window.location.href = targetPath;
        }
    }
}

// Initialize language manager globally
let languageManager;

// Centralized Scroll Management with Safety Features
class ScrollManager {
    constructor() {
        this.locks = new Set();
        this.lockTimeout = null;
    }
    
    lock(source) {
        if (isDevMode) {
            console.log(`ScrollManager: Locking scroll for ${source}`);
        }
        this.locks.add(source);
        if (this.locks.size === 1) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('scroll-locked');
        }
        // Safety timeout after 10 seconds
        this.setSafetyTimeout();
    }
    
    setSafetyTimeout() {
        clearTimeout(this.lockTimeout);
        this.lockTimeout = setTimeout(() => {
            if (isDevMode) {
                console.warn('ScrollManager: Force unlock after 10s timeout');
            }
            this.forceUnlockAll();
        }, 10000);
    }
    
    unlock(source) {
        if (isDevMode) {
            console.log(`ScrollManager: Unlocking scroll for ${source}`);
        }
        this.locks.delete(source);
        if (this.locks.size === 0) {
            document.body.style.overflow = '';
            document.body.classList.remove('scroll-locked');
            clearTimeout(this.lockTimeout);
        }
    }
    
    forceUnlockAll() {
        if (isDevMode) {
            console.warn('ScrollManager: Force unlocking all');
        }
        this.locks.clear();
        document.body.style.overflow = '';
        document.body.classList.remove('scroll-locked');
        clearTimeout(this.lockTimeout);
    }
    
    status() {
        return {
            locked: this.locks.size > 0,
            sources: Array.from(this.locks)
        };
    }
}

const scrollManager = new ScrollManager();

// Global interval tracker for cleanup
const intervalTracker = new Set();

// Timeline functionality
class Timeline {
    constructor() {
        this.currentIndex = 0;
        this.timelineData = window.timelineData || [];
        this.autoplayInterval = null;
        this.isPlaying = false;
        this.retryCount = 0;
        this.MAX_RETRIES = 3;
        // Delay initialization to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // DOM already loaded, init with small delay for safety
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        // Check if data is available with max retry limit
        if (!this.timelineData || !this.timelineData.length) {
            if (this.retryCount >= this.MAX_RETRIES) {
                // Max retries reached - fail gracefully
                return;
            }
            this.retryCount++;
            // Timeline: Waiting for data...
            // Retry in case data loads asynchronously
            const retryTimeout = setTimeout(() => {
                this.timelineData = window.timelineData || [];
                if (this.timelineData.length) {
                    this.init();
                }
            }, 200);
            return;
        }
        
        // Check if containers exist
        const yearsContainer = document.querySelector('.timeline-years');
        const contentContainer = document.querySelector('.timeline-content');
        
        if (!yearsContainer || !contentContainer) {
            // Try again after a delay
            setTimeout(() => this.init(), 200);
            return;
        }
        
        this.renderTimelineTrack();
        this.showExperience(0); // Show first (most recent) experience
        this.bindEvents();
    }
    
    renderTimelineTrack() {
        const yearsContainer = document.querySelector('.timeline-years');
        if (!yearsContainer || !this.timelineData.length) {
            return;
        }
        
        // Clear existing content
        // Clear container safely
        while (yearsContainer.firstChild) {
            yearsContainer.removeChild(yearsContainer.firstChild);
        }
        
        // Create timeline points
        this.timelineData.forEach((exp, index) => {
            const point = document.createElement('div');
            point.className = 'timeline-point';
            point.dataset.index = index;
            // Set initial offset for fade effect (0 is active initially)
            point.dataset.offset = index;
            
            // Add marker icon
            const marker = document.createElement('span');
            marker.className = 'timeline-marker';
            marker.textContent = exp.icon || '•';
            point.appendChild(marker);
            
            // Add year label
            const label = document.createElement('span');
            label.className = 'timeline-label';
            label.textContent = exp.year;
            point.appendChild(label);
            
            // Add click handler
            point.addEventListener('click', () => {
                this.showExperience(index);
            });
            
            yearsContainer.appendChild(point);
        });
    }
    
    showExperience(index) {
        if (index < 0 || index >= this.timelineData.length) {
            return;
        }
        
        this.currentIndex = index;
        const exp = this.timelineData[index];
        const lang = document.querySelector('#lang-checkbox')?.checked ? 'en' : 'fr';
        
        // Update active point and data offsets for fade effect
        document.querySelectorAll('.timeline-point').forEach((point, i) => {
            point.classList.toggle('active', i === index);
            // Set data-offset for carousel effect
            const offset = i - index;
            point.setAttribute('data-offset', offset);
            
            // Mobile carousel: manage visibility and ordering
            if (window.innerWidth <= 768) {
                // Reset styles
                point.style.order = '';
                point.style.display = '';
                
                // Apply carousel logic - only show 3 items
                if (offset === 0) {
                    // Current item - center
                    point.style.order = '2';
                    point.style.display = 'flex';
                } else if (offset === -1) {
                    // Previous item - left
                    point.style.order = '1';
                    point.style.display = 'flex';
                } else if (offset === 1) {
                    // Next item - right  
                    point.style.order = '3';
                    point.style.display = 'flex';
                } else {
                    // Hide all other items
                    point.style.display = 'none';
                }
            } else {
                // Reset for desktop
                point.style.order = '';
                point.style.display = '';
            }
        });
        
        // Update year display
        const yearDisplay = document.querySelector('.timeline-year-display');
        if (yearDisplay) {
            yearDisplay.textContent = exp.year;
        }
        
        // Build content HTML
        let contentHTML = `
            <div class="timeline-job-title">
                ${exp.title[lang]}
                ${exp.type ? `<span class="timeline-type ${exp.type}">${exp.type}</span>` : ''}
            </div>
            <div class="timeline-company">${exp.company}</div>
            <div class="timeline-duration">${exp.duration[lang] || exp.duration}</div>
            <div class="timeline-description">${exp.description[lang]}</div>
        `;
        
        // Add achievements
        if (exp.achievements && exp.achievements[lang]) {
            contentHTML += '<div class="timeline-achievements"><ul>';
            exp.achievements[lang].forEach(achievement => {
                contentHTML += `<li>${achievement}</li>`;
            });
            contentHTML += '</ul></div>';
        }
        
        // Add tech stack
        if (exp.tech && exp.tech.length > 0) {
            contentHTML += '<div class="timeline-tech">';
            exp.tech.forEach(tech => {
                contentHTML += `<span class="timeline-tech-item">${tech}</span>`;
            });
            contentHTML += '</div>';
        }
        
        // Add command
        if (exp.command) {
            contentHTML += `<div class="timeline-command">${exp.command}</div>`;
        }
        
        // Update content with animation
        const contentDiv = document.querySelector('.timeline-content');
        if (contentDiv) {
            contentDiv.style.opacity = '0';
            setTimeout(() => {
                // Safe innerHTML: contentHTML is from trusted internal data
                contentDiv.innerHTML = contentHTML; // Safe: internal timeline data only
                contentDiv.style.opacity = '1';
            }, 150);
        }
        
        // Scroll timeline track to show active point
        const activePoint = document.querySelector('.timeline-point.active');
        if (activePoint) {
            const track = document.querySelector('.timeline-track');
            if (track) {
                const pointOffset = activePoint.offsetLeft;
                const trackWidth = track.clientWidth;
                const scrollPosition = pointOffset - (trackWidth / 2) + (activePoint.offsetWidth / 2);
                track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            }
        }
    }
    
    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stopAutoplay();
                this.previousExperience();
            } else if (e.key === 'ArrowRight') {
                this.stopAutoplay();
                this.nextExperience();
            }
        });
        
        // Mobile timeline swipe and tap navigation
        const timelineTrack = document.querySelector('.timeline-track');
        if (timelineTrack && window.innerWidth <= 768) {
            let touchStartX = 0;
            let touchStartTime = 0;
            
            // Swipe gesture support for natural mobile interaction
            timelineTrack.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartTime = Date.now();
            }, { passive: true });
            
            timelineTrack.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndTime = Date.now();
                const swipeDistance = touchStartX - touchEndX;
                const swipeTime = touchEndTime - touchStartTime;
                
                // Detect quick swipe (less than 300ms and more than 50px)
                if (swipeTime < 300 && Math.abs(swipeDistance) > 50) {
                    this.stopAutoplay();
                    if (swipeDistance > 0) {
                        // Swipe left - go to next
                        this.nextExperience();
                    } else {
                        // Swipe right - go to previous
                        this.previousExperience();
                    }
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Tap navigation as fallback
            timelineTrack.addEventListener('click', (e) => {
                const rect = timelineTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                // Check if clicked on left third (previous)
                if (clickX < rect.width / 3) {
                    this.stopAutoplay();
                    this.previousExperience();
                }
                // Check if clicked on right third (next)
                else if (clickX > (rect.width * 2 / 3)) {
                    this.stopAutoplay();
                    this.nextExperience();
                }
            });
        }
        
        // Button controls
        const prevBtn = document.querySelector('.timeline-prev');
        const nextBtn = document.querySelector('.timeline-next');
        const playBtn = document.querySelector('.timeline-play');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopAutoplay();
                this.previousExperience();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopAutoplay();
                this.nextExperience();
            });
        }
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.toggleAutoplay();
            });
        }
        
        // Update timeline when language changes
        const langCheckboxes = document.querySelectorAll('#lang-checkbox');
        langCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                this.showExperience(this.currentIndex);
            });
        });
    }
    
    previousExperience() {
        if (this.currentIndex > 0) {
            this.showExperience(this.currentIndex - 1);
        } else {
            // Loop to the end
            this.showExperience(this.timelineData.length - 1);
        }
    }
    
    nextExperience() {
        if (this.currentIndex < this.timelineData.length - 1) {
            this.showExperience(this.currentIndex + 1);
        } else {
            // Loop to the beginning
            this.showExperience(0);
        }
    }
    
    toggleAutoplay() {
        if (this.isPlaying) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }
    
    startAutoplay() {
        if (shouldReduceMotion) {
            this.stopAutoplay();
            return;
        }
        if (this.autoplayInterval || !Array.isArray(this.timelineData) || this.timelineData.length <= 1) {
            return;
        }
        this.isPlaying = true;
        const playBtn = document.querySelector('.timeline-play');
        if (playBtn) {
            playBtn.classList.add('playing');
            const playIcon = playBtn.querySelector('.play-icon');
            const pauseIcon = playBtn.querySelector('.pause-icon');
            if (playIcon) playIcon.classList.add('is-hidden');
            if (pauseIcon) pauseIcon.classList.remove('is-hidden');
        }
        
        // Start the autoplay interval
        this.autoplayInterval = setInterval(() => {
            this.nextExperience();
        }, 5000); // Change every 5 seconds
        
        // Track the interval for cleanup
        intervalTracker.add(this.autoplayInterval);
    }
    
    stopAutoplay() {
        this.isPlaying = false;
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            intervalTracker.delete(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        const playBtn = document.querySelector('.timeline-play');
        if (playBtn) {
            playBtn.classList.remove('playing');
            const playIcon = playBtn.querySelector('.play-icon');
            const pauseIcon = playBtn.querySelector('.pause-icon');
            if (playIcon) playIcon.classList.remove('is-hidden');
            if (pauseIcon) pauseIcon.classList.add('is-hidden');
        }
    }
}

// Apply Liquid Glass effects to elements
function applyLiquidGlassEffects() {
    if (shouldReduceMotion) {
        return;
    }
    // Add breathing effect to terminal headers
    document.querySelectorAll('.terminal-header').forEach(header => {
        header.classList.add('breathing-glass');
    });
    
    // Add liquid ripple to interactive elements
    document.querySelectorAll('.contact-item, .stat-item, .perf-item').forEach(item => {
        item.classList.add('liquid-ripple');
    });
    
    // Enhance traffic lights hover effects
    document.querySelectorAll('.terminal-controls').forEach(controls => {
        controls.addEventListener('mouseenter', () => {
            controls.parentElement.style.background = 'var(--liquid-bg-secondary)';
        });
        controls.addEventListener('mouseleave', () => {
            controls.parentElement.style.background = '';
        });
    });
    
    // Add liquid animation to toggles
    document.querySelectorAll('.lang-switch input, .theme-switch input').forEach(input => {
        input.addEventListener('change', function() {
            const slider = this.nextElementSibling;
            if (slider) {
                // Trigger liquid ripple animation
                slider.style.animation = 'none';
                setTimeout(() => {
                    slider.style.animation = '';
                }, 10);
            }
        });
    });
}

const getCurrentLanguage = () => {
    const lang = typeof languageManager !== 'undefined' && languageManager?.getCurrentLang
        ? languageManager.getCurrentLang()
        : (document.documentElement.getAttribute('lang') || 'fr');
    return lang && lang.toLowerCase().startsWith('en') ? 'en' : 'fr';
};

const isTypingContext = () => {
    const active = document.activeElement;
    if (!active) {
        return false;
    }
    if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') {
        return true;
    }
    return Boolean(active.isContentEditable);
};

const initInteractiveTerminals = () => {
    const terminals = Array.from(document.querySelectorAll('.terminal-input'));
    if (!terminals.length) {
        return;
    }

    terminals.forEach((terminal) => {
        if (!terminal || terminal.querySelector('.terminal-typed')) {
            return;
        }

        const prompt = terminal.querySelector('.prompt');
        const cursor = terminal.querySelector('.cursor');
        if (!prompt || !cursor) {
            return;
        }

        const typed = document.createElement('span');
        typed.className = 'terminal-typed';
        typed.setAttribute('contenteditable', 'true');
        typed.setAttribute('role', 'textbox');
        typed.setAttribute('aria-label', 'Terminal input');
        typed.setAttribute('spellcheck', 'false');
        typed.setAttribute('autocapitalize', 'off');
        typed.setAttribute('autocomplete', 'off');
        typed.setAttribute('autocorrect', 'off');
        typed.tabIndex = 0;

        terminal.classList.add('is-interactive');
        terminal.insertBefore(typed, cursor);

        const focusTyped = () => {
            typed.focus();
            const selection = window.getSelection?.();
            if (!selection) {
                return;
            }
            const range = document.createRange();
            range.selectNodeContents(typed);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        };

        terminal.addEventListener('click', () => {
            focusTyped();
        });

        typed.addEventListener('paste', (event) => {
            event.preventDefault();
            const text = event.clipboardData?.getData('text/plain') || '';
            document.execCommand('insertText', false, text);
        });

        const submitTyped = () => {
            const rawValue = typed.textContent || '';
            const trimmed = rawValue.replace(/\s+/g, ' ').trim();
            const maskLength = Math.max(1, trimmed.length);
            const mask = '•'.repeat(maskLength);

            const interaction = document.createElement('div');
            interaction.className = 'output terminal-interaction';

            const commandLine = document.createElement('p');
            commandLine.className = 'command terminal-command-line';

            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = (prompt.textContent || '').trim();

            const maskSpan = document.createElement('span');
            maskSpan.className = 'terminal-mask';
            maskSpan.textContent = ` ${mask}`;

            commandLine.appendChild(promptSpan);
            commandLine.appendChild(maskSpan);

            const error = document.createElement('p');
            error.className = 'terminal-error';
            error.setAttribute('data-fr', 'Mot de passe incorrect. Réessayez.');
            error.setAttribute('data-en', 'Incorrect password. Try again.');
            const lang = getCurrentLanguage();
            error.textContent = lang === 'en'
                ? 'Incorrect password. Try again.'
                : 'Mot de passe incorrect. Réessayez.';

            interaction.appendChild(commandLine);
            interaction.appendChild(error);

            terminal.insertAdjacentElement('beforebegin', interaction);

            typed.textContent = '';
            focusTyped();

            if (!shouldReduceMotion) {
                interaction.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                interaction.scrollIntoView({ block: 'nearest' });
            }
        };

        typed.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitTyped();
                return;
            }
            if (event.key === 'Tab') {
                event.preventDefault();
                return;
            }
            if (event.key.length === 1 && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
                return;
            }
        });
    });
};

const initTableOfContents = () => {
    const tocElements = Array.from(document.querySelectorAll('details[data-toc]'));
    if (tocElements.length === 0) {
        return;
    }

    if (!window.matchMedia('(min-width: 640px)').matches) {
        return;
    }

    tocElements.forEach((toc) => {
        toc.open = true;
    });
};

const initApp = () => {
    applyLiquidGlassEffects();

    languageManager = new LanguageManager();
    new ThemeManager();
    initInteractiveTerminals();
    initTableOfContents();

    scheduleIdle(() => {
        if (document.querySelector('a[href^="#"]')) {
            new SmoothScroll();
        }
    });

    scheduleIdle(() => {
        if ('performance' in window) {
            new PerformanceMonitor();
        }
    });

    scheduleIdle(() => {
        if (!window.timelineData || !document.querySelector('.timeline-container')) {
            return;
        }
        const timeline = new Timeline();
        timelineInstance = timeline;
        if (isDevMode) {
            window._timeline = timeline;
        } else if (window._timeline) {
            delete window._timeline;
        }
        if (shouldReduceMotion) {
            timeline.stopAutoplay();
        }
    }, 300);

    requestAnimationFrame(() => {
        generateQuote();
    });

    document.querySelectorAll('[data-action="generate-quote"]').forEach((button) => {
        button.addEventListener('click', () => {
            generateQuote();
        });
    });

	    document.querySelectorAll('[data-nav-home]').forEach((button) => {
	        const target = button.getAttribute('data-nav-home');
	        if (!target) {
	            return;
	        }
	        button.addEventListener('click', () => {
	            window.location.href = target;
	        });
	    });

	    document.querySelectorAll('[data-scroll-top]').forEach((button) => {
	        button.addEventListener('click', () => {
	            const behavior = shouldReduceMotion ? 'auto' : 'smooth';
	            try {
	                window.scrollTo({ top: 0, left: 0, behavior });
	            } catch (_) {
	                window.scrollTo(0, 0);
	            }
	        });
	    });

	    renderBlogPager();
	
	    if (!shouldReduceMotion && 'IntersectionObserver' in window) {
	        const observerOptions = {
	            threshold: 0.1,
	            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            });
        }, observerOptions);

        document.querySelectorAll('.output').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.output').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    if (!shouldReduceMotion && !document.querySelector('.terminal-typed')) {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            const commands = ['whoami', 'ls -la', 'cat vision.txt', './run aurora'];
            let currentCommand = 0;

            const promptInterval = setInterval(() => {
                const prompt = document.querySelector('.prompt');
                if (prompt && Math.random() > 0.95) {
                    const originalText = prompt.textContent;
                    prompt.textContent = 'admin@tommysuzanne.com ~$ ' + commands[currentCommand];

                    setTimeout(() => {
                        prompt.textContent = originalText;
                        currentCommand = (currentCommand + 1) % commands.length;
                    }, 2000);
                }
            }, 5000);

            intervalTracker.add(promptInterval);
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!isTypingContext()) {
                const themeCheckbox = document.getElementById('theme-checkbox');
                if (themeCheckbox) {
                    themeCheckbox.checked = !themeCheckbox.checked;
                    themeCheckbox.dispatchEvent(new Event('change'));
                }
            }
        }

        if (e.key === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!isTypingContext()) {
                generateQuote();
            }
        }

        if (e.key === 'l' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (!isTypingContext()) {
                languageManager?.toggle();
            }
        }

        if (e.key === 'Escape') {
            scrollManager.forceUnlockAll();
            if (isDevMode) {
                console.log('Emergency scroll unlock triggered');
            }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (timelineInstance && timelineInstance.isPlaying) {
                timelineInstance.stopAutoplay();
                timelineInstance.wasPlayingBeforeHidden = true;
            }
        } else if (timelineInstance && timelineInstance.wasPlayingBeforeHidden && !shouldReduceMotion) {
            timelineInstance.startAutoplay();
            timelineInstance.wasPlayingBeforeHidden = false;
        }
    });

    window.addEventListener('beforeunload', () => {
        intervalTracker.forEach(id => clearInterval(id));
        intervalTracker.clear();
        scrollManager.forceUnlockAll();
    });
};

const bootApplication = () => scheduleIdle(initApp, 100);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApplication, { once: true });
} else {
    bootApplication();
}
