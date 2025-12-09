# Guía de Configuración en Netlify

Esta guía te ayudará a desplegar el sitio de Cargo Alhama en Netlify con Decap CMS.

## 📋 Pasos para Desplegar en Netlify

### 1. Crear cuenta en Netlify

1. Ve a [https://www.netlify.com](https://www.netlify.com)
2. Haz clic en "Sign up" y elige "Sign up with GitHub"
3. Autoriza Netlify para acceder a tu repositorio

### 2. Conectar el Repositorio

1. En el dashboard de Netlify, haz clic en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Busca y selecciona el repositorio: **`pattterns/cargoalhama`**
4. Netlify detectará automáticamente la configuración desde `netlify.toml`

### 3. Configuración de Build (Automática)

Netlify debería detectar automáticamente:
- **Build command**: `npm run build`
- **Publish directory**: `_site`
- **Base directory**: (dejar vacío)

Si no se detecta automáticamente, configura manualmente:
- **Build command**: `npm run build`
- **Publish directory**: `_site`

### 4. Configurar Netlify Identity para Decap CMS

1. En el dashboard de Netlify, ve a **Site settings** → **Identity**
2. Haz clic en **"Enable Identity"**
3. En **"Registration preferences"**, selecciona **"Invite only"** (recomendado) o **"Open"**
4. En **"External providers"**, puedes configurar GitHub OAuth (opcional)
5. Guarda los cambios

### 5. Configurar Git Gateway

1. En **Site settings** → **Identity** → **Services**
2. Haz clic en **"Enable Git Gateway"**
3. Esto permitirá que Decap CMS haga commits automáticamente

### 6. Primer Despliegue

1. Netlify comenzará a construir el sitio automáticamente
2. Espera a que termine el build (puede tardar 1-2 minutos)
3. Una vez completado, verás la URL de tu sitio: `https://tu-sitio.netlify.app`

### 7. Acceder al Panel de Decap CMS

1. Ve a `https://tu-sitio.netlify.app/admin`
2. La primera vez, Netlify te pedirá crear una cuenta o iniciar sesión
3. Una vez autenticado, verás el panel de Decap CMS

## 🔧 Configuración Adicional

### Variables de Entorno (si es necesario)

Si necesitas variables de entorno:
1. Ve a **Site settings** → **Environment variables**
2. Agrega las variables necesarias

### Dominio Personalizado

1. Ve a **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio

### Actualizar admin/config.yml (si cambias de rama)

Si cambias la rama principal de `master` a `main`:
1. Edita `admin/config.yml`
2. Cambia `branch: master` a `branch: main`
3. Haz commit y push
4. Netlify se redeplegará automáticamente

## ✅ Verificación

Después del despliegue, verifica:

- [ ] El sitio carga correctamente en la URL de Netlify
- [ ] Todas las imágenes se muestran correctamente
- [ ] El formulario de contacto funciona
- [ ] Puedes acceder a `/admin` y ver el panel de Decap CMS
- [ ] Puedes editar contenido desde Decap CMS y los cambios se guardan

## 🐛 Solución de Problemas

### El build falla

- Verifica que `package.json` tenga todas las dependencias
- Revisa los logs de build en Netlify para ver el error específico

### Decap CMS no carga

- Verifica que `admin/config.yml` tenga el repositorio correcto
- Asegúrate de que Git Gateway esté habilitado
- Verifica que la rama en `config.yml` coincida con la rama principal

### Los cambios no se guardan

- Verifica que Git Gateway esté habilitado
- Revisa que tengas permisos de escritura en el repositorio
- Verifica que la rama en `config.yml` sea correcta

## 📞 Soporte

Si tienes problemas, consulta:
- [Documentación de Netlify](https://docs.netlify.com/)
- [Documentación de Decap CMS](https://decapcms.org/docs/)
- Los logs de build en el dashboard de Netlify
