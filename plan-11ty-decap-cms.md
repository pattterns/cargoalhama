# Plan de Desarrollo: 11ty + Decap CMS

**Objetivo:** Convertir tu proyecto HTML + CSS en un sitio estático con CMS editable para clientes.

**Stack:**
- **Generador:** 11ty (Eleventy) — GRATIS, open source
- **CMS:** Decap CMS — GRATIS, open source
- **Hosting:** Netlify — GRATIS tier (suficiente para clientes)
- **Versionado:** GitHub — GRATIS

---

## Fase 1: Inicializar proyecto 11ty

### 1.1. Crear estructura base

```bash
# En tu terminal, en Cursor o comando directo
mkdir mi-proyecto-11ty
cd mi-proyecto-11ty
npm init -y
npm install -D @11ty/eleventy
```

### 1.2. Crear estructura de carpetas

```
mi-proyecto-11ty/
├── _data/               # Archivos de contenido (JSON/YAML que edita Decap)
│   └── site.json        # Datos globales
├── _includes/           # Templates/Layouts reutilizables
│   └── layout.html      # Layout base
├── _site/               # OUTPUT (generado por 11ty, no subir a Git)
├── content/             # Colecciones de contenido (blog, posts, etc.)
│   └── posts/
├── css/                 # Tu CSS
│   └── style.css
├── js/                  # Tu JavaScript
├── images/              # Imágenes
├── admin/               # Panel de Decap CMS
│   ├── config.yml       # Configuración de Decap
│   └── index.html       # Interfaz de Decap
├── .eleventy.js         # Configuración de 11ty
├── .gitignore           # Ignora _site/ y node_modules/
└── index.md o index.html # Tu página principal
```

### 1.3. Configurar `.eleventy.js`

Crea archivo `.eleventy.js` en la raíz:

```javascript
module.exports = function(eleventyConfig) {
  // Copiar CSS, JS, imágenes al output (_site)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin"); // Importante: incluir panel de Decap
  eleventyConfig.addPassthroughCopy("_data"); // Datos JSON/YAML
  
  // Devuelve config
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};
```

### 1.4. Crear `package.json` scripts

Edita `package.json` y agrega en `"scripts"`:

```json
"scripts": {
  "build": "eleventy",
  "serve": "eleventy --serve",
  "dev": "eleventy --serve --watch"
}
```

Ahora puedes:
- `npm run dev` → Desarrollar localmente con live reload
- `npm run build` → Generar output para producción

---

## Fase 2: Pasar tu HTML actual a 11ty

### 2.1. Crear un layout base

Crea `_includes/layout.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- Tu navbar, header, etc. -->
    <header>
        <h1>{{ site.title }}</h1>
    </header>

    <!-- El contenido dinámico entra aquí -->
    <main>
        {{ content | safe }}
    </main>

    <!-- Tu footer, scripts, etc. -->
    <footer>
        <p>&copy; 2025 {{ site.title }}</p>
    </footer>

    <script src="/js/script.js"></script>
</body>
</html>
```

### 2.2. Crear `_data/site.json`

Crea `_data/site.json` (datos globales que Decap editará):

```json
{
  "title": "Mi Agencia",
  "description": "Hacemos webs y automatización con IA",
  "url": "https://tudominio.com",
  "author": "Tu Nombre",
  "email": "contacto@tuagencia.es",
  "phone": "+34 600 000 000",
  "social": {
    "linkedin": "https://linkedin.com/company/tuagencia",
    "twitter": "https://twitter.com/tuagencia"
  }
}
```

### 2.3. Crear página principal

Crea `index.md`:

```markdown
---
layout: layout.html
title: Inicio
permalink: /
---

# Bienvenido a {{ site.title }}

{{ site.description }}

## Servicios

- Desarrollo web con IA
- Automatización con Make.com
- Estrategia digital
```

### 2.4. Copiar tu CSS y JS

- Mueve tu `style.css` a `/css/style.css`
- Mueve tu `script.js` a `/js/script.js`
- Ajusta rutas si es necesario (cambia rutas relativas si las hay)

---

## Fase 3: Instalar y configurar Decap CMS

### 3.1. Crear `admin/index.html`

Crea `admin/index.html`:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Administración - Decap CMS</title>
</head>
<body>
  <!-- Include the script that builds the page and powers Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### 3.2. Crear `admin/config.yml`

Crea `admin/config.yml` (la configuración de Decap):

```yaml
backend:
  name: github
  repo: tu-usuario/tu-repo-nombre   # CAMBIAR: usuario/repo
  branch: main
  auth_endpoint: api/auth

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  # Colección: Datos del sitio (aparece SOLO una entrada editable)
  - name: "site"
    label: "Configuración del Sitio"
    files:
      - file: "_data/site.json"
        label: "Info Principal"
        name: "site_config"
        fields:
          - { label: "Título del Sitio", name: "title", widget: "string" }
          - { label: "Descripción", name: "description", widget: "text" }
          - { label: "URL", name: "url", widget: "string" }
          - { label: "Email", name: "email", widget: "string" }
          - { label: "Teléfono", name: "phone", widget: "string" }
          - label: "Redes Sociales"
            name: "social"
            widget: "object"
            fields:
              - { label: "LinkedIn", name: "linkedin", widget: "string", required: false }
              - { label: "Twitter", name: "twitter", widget: "string", required: false }

  # Colección: Página principal (si quieres que edite el contenido del index)
  - name: "pages"
    label: "Páginas"
    folder: "content/pages"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "URL", name: "permalink", widget: "string", pattern: ["^/.*", "URL debe empezar con /"] }
      - { label: "Contenido", name: "body", widget: "markdown" }

  # Colección: Blog (si tienes)
  - name: "blog"
    label: "Blog"
    folder: "content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Descripción", name: "description", widget: "text" }
      - { label: "Fecha", name: "date", widget: "datetime" }
      - { label: "Autor", name: "author", widget: "string" }
      - { label: "Imagen", name: "image", widget: "image" }
      - { label: "Contenido", name: "body", widget: "markdown" }

  # Colección: Equipo (si tienes página de equipo)
  - name: "team"
    label: "Equipo"
    folder: "content/team"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Nombre", name: "name", widget: "string" }
      - { label: "Cargo", name: "role", widget: "string" }
      - { label: "Bio", name: "bio", widget: "text" }
      - { label: "Foto", name: "photo", widget: "image" }
      - { label: "LinkedIn", name: "linkedin", widget: "string", required: false }
```

**IMPORTANTE:** Cambia `repo: tu-usuario/tu-repo-nombre` por el nombre real de tu repo.

### 3.3. Agregar `.gitignore`

Crea `.gitignore` en raíz:

```
node_modules/
_site/
.DS_Store
*.log
.env.local
```

---

## Fase 4: Conectar con GitHub

### 4.1. Crear repo en GitHub

1. Ve a https://github.com/new
2. Crea repo llamado `tu-proyecto-11ty` (cambiar nombre si quieres)
3. NO inicialices con README
4. Copia el comando que te da GitHub

### 4.2. Subir código local a GitHub

```bash
git init
git add .
git commit -m "Initial commit: 11ty + Decap CMS setup"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-proyecto-11ty.git
git push -u origin main
```

---

## Fase 5: Configurar autenticación de Decap

Decap necesita autenticación para que el cliente pueda editar contenido. Hay dos opciones:

### Opción A: GitHub OAuth (más seguro, recomendado)

1. Ve a GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. **Application name:** `tu-proyecto-decap`
3. **Homepage URL:** `https://tudominio.com`
4. **Authorization callback URL:** `https://api.github.com/login/oauth/authorize` (o según la documentación de Decap)
5. Copia `Client ID` y `Client Secret`
6. En tu repo, crea archivo `.env.local`:
   ```
   DECAP_GITHUB_CLIENT_ID=tu_client_id_aqui
   DECAP_GITHUB_CLIENT_SECRET=tu_client_secret_aqui
   ```

### Opción B: Netlify Identity (más simple para beginners)

Si usas **Netlify hosting** (Fase 6):
- Netlify genera la autenticación automáticamente.
- En `admin/config.yml` cambias solo:
  ```yaml
  backend:
    name: github
    repo: tu-usuario/tu-repo-nombre
    branch: main
  ```
- Netlify lo maneja mágicamente.

---

## Fase 6: Desplegar a hosting

### Opción 1: Vercel (recomendado para tu caso)

1. Ve a https://vercel.com → Sign up (con GitHub)
2. Conecta tu repo
3. En "Build Command": `npm run build`
4. En "Output Directory": `_site`
5. Click Deploy
6. Ya está online en `tu-proyecto.vercel.app`

### Opción 2: Netlify

1. Ve a https://netlify.com → Sign up (con GitHub)
2. Conecta tu repo
3. En "Build command": `npm run build`
4. En "Publish directory": `_site`
5. Click Deploy
6. Ya está online en `tu-proyecto.netlify.app`

### Opción 3: Cloudflare Pages (más barato, pero un poco más técnico)

1. Ve a https://dash.cloudflare.com → Pages → Create a project
2. Conecta tu repo (GitHub)
3. En "Build command": `npm run build`
4. En "Build output directory": `_site`
5. Click Deploy

**Bonus:** Con cualquiera de estos:
- Dominio personalizado: conecta tu dominio (CNAME o A records)
- SSL/HTTPS: automático en todos

---

## Fase 7: Entregar al cliente

### Acceso al CMS

El cliente accede a:
```
https://tudominio.com/admin
```

Allí ve un panel donde puede editar:
- Título, descripción, contacto
- Blog posts (crear/editar/borrar)
- Equipo
- Páginas

### Flujo del cliente

1. Va a `/admin`
2. Se autentica (con GitHub o Netlify Identity)
3. Edita contenido
4. Presiona "Publish"
5. Decap hace commit automáticamente
6. Vercel/Netlify se redeploya
7. Cambios live en 30-60 segundos

### Documentación para el cliente

Crea `CLIENTE_README.md` en el repo:

```markdown
# Guía para editar el sitio

## Acceso
- URL del panel: https://tudominio.com/admin
- Usuario: tu email (el que configuramos)
- Contraseña: [la que uses en GitHub/Netlify]

## Qué puedes editar

### 1. Datos del sitio
- Vamos a "Configuración del Sitio"
- Cambias: Título, descripción, email, teléfono, redes sociales
- Presiona "Publish"

### 2. Blog
- Vamos a "Blog"
- "New Blog" para crear post
- Rellena: Título, descripción, fecha, autor, imagen, contenido
- Presiona "Publish"

### 3. Equipo
- Vamos a "Equipo"
- "New Team" para agregar miembro
- Rellena: Nombre, cargo, bio, foto
- Presiona "Publish"

## ¿Algo falla?
- Contacta a [tu email]
- NO hagas commits directos en GitHub (Decap se encarga)
```

---

## Checklist de desarrollo

### Setup local
- [ ] `npm install @11ty/eleventy`
- [ ] `.eleventy.js` creado
- [ ] Carpetas (`_data/`, `_includes/`, `css/`, etc.) creadas
- [ ] `package.json` scripts agregados
- [ ] `npm run dev` funciona localmente

### 11ty
- [ ] `_includes/layout.html` con template base
- [ ] `_data/site.json` con datos globales
- [ ] `index.md` o páginas principales convertidas
- [ ] CSS y JS copiados a sus carpetas
- [ ] Build sin errores (`npm run build`)

### Decap CMS
- [ ] `admin/index.html` creado
- [ ] `admin/config.yml` configurado (repo correcto)
- [ ] Colecciones definidas (site, blog, pages, etc.)
- [ ] Media folder apunta a `images/uploads`

### GitHub
- [ ] Repo creado en GitHub
- [ ] `.gitignore` agregado
- [ ] Todo pusheado a `main`

### Hosting
- [ ] Repo conectado a Vercel/Netlify/Cloudflare Pages
- [ ] Build command: `npm run build`
- [ ] Output directory: `_site`
- [ ] Primer deploy exitoso
- [ ] HTTPS funcionando

### Decap OAuth (si aplica)
- [ ] GitHub OAuth App creado
- [ ] Client ID/Secret guardados (variables de entorno)
- [ ] Autenticación testeada en `/admin`

### Cliente
- [ ] Acceso a `/admin` testeado
- [ ] Puede editar contenido sin tocar código
- [ ] Cambios se despliegan automáticamente
- [ ] Documentación entregada

---

## Costos

| Componente | Costo |
|-----------|-------|
| 11ty | GRATIS (open source) |
| Decap CMS | GRATIS (open source) |
| GitHub | GRATIS |
| Vercel hosting (free tier) | GRATIS (100 GB bandwidth) |
| Netlify hosting (free tier) | GRATIS (100 GB bandwidth) |
| Cloudflare Pages (free tier) | GRATIS (unlimited bandwidth) |
| Dominio personalizado | $10-15/año (tu registrador) |
| **TOTAL para proyecto básico** | **GRATIS** (si usas tier gratuito) |

---

## Troubleshooting

### "admin/config.yml no aparece en el panel"
→ Verifica que esté en `admin/config.yml` (no `admin/config.yaml`)
→ Recarga `/admin` en el navegador

### "GitHub OAuth no funciona"
→ Verifica que el `repo:` en config.yml sea `usuario/repo-exacto`
→ Si usas Netlify, usa "Netlify Identity" en lugar de GitHub OAuth

### "Los cambios no se despliegan"
→ Espera 30-60 segundos (Vercel/Netlify tarda en redeplegar)
→ Revisa en GitHub que haya un nuevo commit

### "Mi CSS/JS no aparecen"
→ Verifica que `.eleventy.js` tenga `addPassthroughCopy("css")` y `addPassthroughCopy("js")`
→ Corre `npm run build` de nuevo

---

## Próximos pasos (opcional)

1. **SEO:** Agregar meta tags, sitemap, robots.txt
2. **Contacto:** Form con backend serverless (Vercel Functions, Netlify Functions)
3. **Análisis:** Integrar Plausible o Google Analytics
4. **Backup:** Cron job para backupear commits a otro repo
5. **Staging:** Branch `staging` con preview automático antes de `main`

---

**Creado para:** Desarrollo rápido con Cursor + VibeCoding
**Última actualización:** Diciembre 2025
