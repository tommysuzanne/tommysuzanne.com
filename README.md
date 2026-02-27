# tommysuzanne.com

Site personnel de **Tommy Suzanne** (FR/EN), en **HTML/CSS/JS** sans build.

- Site en ligne : https://tommysuzanne.com
- Pages principales : `index.html` (FR) + `en/` (EN)
- Articles : `blog/` (FR) + `en/blog/` (EN)
- Assets : `assets/`

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

