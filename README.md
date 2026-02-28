# Site web personnel de Tommy Suzanne

[![Website](https://img.shields.io/badge/website-tommysuzanne.com-0b7285)](https://tommysuzanne.com) [![Static](https://img.shields.io/badge/site-static-495057)](#d%C3%A9marrer-en-local) [![Code License: MIT](https://img.shields.io/badge/code%20license-MIT-228be6)](LICENSE) [![Content: All rights reserved](https://img.shields.io/badge/content-all%20rights%20reserved-868e96)](CONTENT_LICENSE.md)

Code source de mon site personnel construit en **HTML/CSS/JS** (sans build).

- 🌐 Site : https://tommysuzanne.com
- 📰 RSS : `rss.xml` (FR) et `en/rss.xml` (EN)

## Sommaire

- [Aperçu](#aper%C3%A7u)
- [À propos](#%C3%A0-propos)
- [Fonctionnalités](#fonctionnalit%C3%A9s)
- [Démarrer en local](#d%C3%A9marrer-en-local)
- [Structure du site](#structure-du-site)
- [Déploiement](#d%C3%A9ploiement)
- [Licence](#licence)

## Aperçu

![Aperçu du site](preview.gif)

## À propos

Je suis **Tommy Suzanne** — *Entredonneur* • Je contribue à édifier une œuvre qui me transcende.

**Aurora** est le fil conducteur du site : l’idée d’un pont entre l’ancien monde et le nouveau, où la technologie et l’intelligence artificielle servent le vivant, l’éthique et la coopération — pour aller vers une économie d’abondance et des projets alignés avec l’évolution humaine.

## Fonctionnalités

- Site statique, rapide, sans dépendances
- Bilingue FR/EN avec bascule de langue
- Thème clair/sombre
- Blog (pages HTML) + RSS
- SEO : `sitemap.xml`, `robots.txt`, balises Open Graph / Twitter

## Démarrer en local

Le site est statique : il suffit de servir le dossier en HTTP.

```bash
git clone https://github.com/tommysuzanne/tommysuzanne.com.git
cd tommysuzanne.com
```

### Option 1 — Python

```bash
python3 -m http.server 8000
```

### Option 2 — Node.js

```bash
npx serve .
```

Ouvrir ensuite http://localhost:8000.

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
├── favicon.svg                # Favicon (SVG)
├── favicon.ico                # Favicon (alias)
├── styles-modern.css          # Styles principaux
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

## Déploiement

Compatible avec n’importe quel hébergeur statique.

### GitHub Pages

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → *Deploy from a branch*
3. Choisir la branche (ex. `main`) et `/ (root)`

Note : `.htaccess` est utile sur Apache (ex. `ErrorDocument 404`), mais n’est pas pris en charge par GitHub Pages.

## Licence

Le dépôt est en **double licence** :

- **Code** (structure, CSS, JS, composants réutilisables) : **MIT** — voir `LICENSE`.
- **Contenu** (textes/copywriting, articles, images/illustrations) : © Tommy Suzanne — **tous droits réservés** — voir `CONTENT_LICENSE.md`.
