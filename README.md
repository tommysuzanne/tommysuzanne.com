C'est le code source de mon site personnel construit en **HTML/CSS/JS** (sans build) et publié sur https://tommysuzanne.com.

# tommysuzanne.com

- Site en ligne : https://tommysuzanne.com
- Pages principales : `index.html` (FR) + `en/` (EN)
- Articles : `blog/` (FR) + `en/blog/` (EN)
- Assets : `assets/`

## À propos

Je suis **Tommy Suzanne** — *Entredonneur* : je fais ce qui doit être fait (pas seulement ce dont j’ai envie) et je construis en pensant à ceux que j’aime.

**Aurora** est le fil conducteur du site : l’idée d’un pont entre l’ancien monde et le nouveau, où la technologie et l’intelligence artificielle servent le vivant, l’éthique et la coopération — pour aller vers une économie d’abondance et des projets alignés avec l’évolution humaine.

## Structure du site

- `index.html` : page d’accueil (FR)
- `en/` : pages en anglais (dont RSS)
- `blog/` : pages d’articles en français
- `en/blog/` : pages d’articles en anglais
- `assets/` : images et médias
- `styles-modern.css`, `styles.css`, `liquid-glass.css`, `institutional.css`, `apple-ux-improvements.css` : styles
- `script.js`, `theme-bootstrap.js`, `quotes.js`, `timeline-data.js` : logique front (thème, langue, interactions, contenu)
- `rss.xml`, `en/rss.xml`, `sitemap.xml`, `robots.txt` : SEO / syndication
- `.htaccess` : config Apache (ex. `ErrorDocument 404`)

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
