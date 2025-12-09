# Cargo Alhama - Sitio Web con 11ty + Decap CMS

Sitio web estático generado con [11ty (Eleventy)](https://www.11ty.dev/) y gestionado con [Decap CMS](https://decapcms.org/).

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo Local

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en `http://localhost:8080` con recarga automática.

### Construcción para Producción

```bash
npm run build
```

El sitio se generará en la carpeta `_site/`.

## 📁 Estructura del Proyecto

```
cargoalhama/
├── _data/               # Datos globales (JSON/YAML editables desde Decap)
│   └── site.json        # Configuración del sitio
├── _includes/           # Templates/Layouts reutilizables
│   └── layout.html      # Layout base
├── _site/               # OUTPUT (generado por 11ty, no subir a Git)
├── admin/               # Panel de Decap CMS
│   ├── config.yml       # Configuración de Decap
│   └── index.html       # Interfaz de Decap
├── css/                 # Estilos CSS
│   └── style.css
├── js/                  # JavaScript
│   └── script.js
├── imagenes/            # Imágenes del sitio
├── content/             # Contenido editable (blog, páginas, etc.)
│   ├── pages/
│   ├── blog/
│   └── team/
├── .eleventy.js         # Configuración de 11ty
├── index.html           # Página principal
└── package.json
```

## 🔧 Configuración de Decap CMS

### Antes de usar Decap CMS

1. **Actualizar `admin/config.yml`**: 
   - Cambia `repo: tu-usuario/tu-repo-nombre` por tu repositorio real de GitHub
   - Ejemplo: `repo: usuario/cargoalhama`

2. **Configurar autenticación**:
   - Si usas **Netlify**: La autenticación se configura automáticamente
   - Si usas **GitHub OAuth**: Sigue las instrucciones en `plan-11ty-decap-cms.md`

### Acceso al CMS

Una vez desplegado, el cliente puede acceder al panel de administración en:
```
https://tudominio.com/admin
```

## 📝 Editar Contenido

### Desde Decap CMS (Recomendado para clientes)

1. Accede a `/admin` en tu sitio
2. Inicia sesión con GitHub o Netlify Identity
3. Edita el contenido directamente desde el panel
4. Los cambios se guardan automáticamente en GitHub

### Desde el código

- **Datos globales**: Edita `_data/site.json`
- **Páginas**: Crea archivos en `content/pages/`
- **Blog**: Crea archivos en `content/blog/`
- **Equipo**: Crea archivos en `content/team/`

## 🌐 Despliegue

### Opción 1: Netlify (Recomendado)

1. Conecta tu repositorio de GitHub a Netlify
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `_site`
3. Despliega

### Opción 2: Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configuración:
   - **Build Command**: `npm run build`
   - **Output Directory**: `_site`
3. Despliega

### Opción 3: Cloudflare Pages

1. Conecta tu repositorio de GitHub a Cloudflare Pages
2. Configuración:
   - **Build command**: `npm run build`
   - **Build output directory**: `_site`
3. Despliega

## 📚 Recursos

- [Documentación de 11ty](https://www.11ty.dev/docs/)
- [Documentación de Decap CMS](https://decapcms.org/docs/)
- [Plan de desarrollo completo](./plan-11ty-decap-cms.md)

## ⚠️ Notas Importantes

- **No edites archivos en `_site/`**: Esta carpeta se genera automáticamente
- **Actualiza `admin/config.yml`**: Cambia el repositorio antes de desplegar
- **Rutas de imágenes**: Usa `/imagenes/` (con barra inicial) en lugar de `imagenes/`

## 📞 Soporte

Para más información, consulta el archivo `plan-11ty-decap-cms.md` que contiene instrucciones detalladas paso a paso.
