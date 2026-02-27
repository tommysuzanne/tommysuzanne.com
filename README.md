# Site web personnel de Tommy Suzanne

C'est le code source de mon site personnel construit en **HTML/CSS/JS** (sans build).

**Copywriting (FR)** : Entredonneur • Je fais ce qui doit être fait, pas seulement ce dont j’ai envie. Je le fais en pensant à ceux que j’aime et c’est ainsi que je crée des choses qui servent plus grand que moi.

**Copywriting (EN)** : giver‑preneur • I do what must be done—not only what I feel like doing. I do it with the people I love in mind, and that’s how I build things that serve something greater than me.

**Tags** : `html` `css` `javascript` `static-site` `bilingual` `seo`

- Site en ligne : https://tommysuzanne.com
- Pages principales : `index.html` (FR) + `en/` (EN)
- Articles : `blog/` (FR) + `en/blog/` (EN)
- Assets : `assets/`

## À propos

Je suis **Tommy Suzanne** — *Entredonneur* : je fais ce qui doit être fait (pas seulement ce dont j’ai envie) et je construis en pensant à ceux que j’aime.

**Aurora** est le fil conducteur du site : l’idée d’un pont entre l’ancien monde et le nouveau, où la technologie et l’intelligence artificielle servent le vivant, l’éthique et la coopération — pour aller vers une économie d’abondance et des projets alignés avec l’évolution humaine.

## Structure du site

```text
.
├── index.html                 # Accueil (FR)
├── 404.html                   # Page 404
├── blog/                      # Articles FR (pages HTML)
├── en/                        # Contenu EN
│   ├── blog/                  # Articles EN (pages HTML)
│   └── rss.xml                # RSS (EN)
├── assets/                    # Assets statiques
│   └── blog/                  # Illustrations des articles (SVG)
├── styles-modern.css          # Styles principaux
├── styles.css                 # Styles legacy / compat
├── liquid-glass.css           # Effets visuels (glass)
├── institutional.css          # Styles “institutionnels”
├── apple-ux-improvements.css  # Ajustements UX
├── script.js                  # Interactions, langue, UX
├── theme-bootstrap.js         # Bootstrapping thème
├── quotes.js                  # Citations / contenu
├── timeline-data.js           # Données timeline
├── rss.xml                    # RSS (FR)
├── sitemap.xml                # Sitemap
├── robots.txt                 # Robots
└── .htaccess                  # Apache (ex. ErrorDocument 404)
```

## Développement local

Le site est statique : il suffit de servir le dossier en HTTP.

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Déploiement

Compatible avec n’importe quel hébergeur statique.

### GitHub Pages

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → *Deploy from a branch*
3. Choisir la branche (ex. `main`) et `/ (root)`

Note : `.htaccess` est utile sur Apache (ex. `ErrorDocument 404`), mais n’est pas pris en charge par GitHub Pages.
