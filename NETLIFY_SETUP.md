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

### Configurar Notificaciones por Email del Formulario de Contacto

Para que los mensajes del formulario lleguen a **juanpablo@ocelot.es**:

#### Paso 1: Verificar que el formulario se detecte

Si no ves el formulario "contacto" en **Site settings** → **Forms**, sigue estos pasos en orden:

1. **Verifica que "Form detection" esté habilitado**:
   - Ve a **Site settings** → **Forms** → **Form detection**
   - Asegúrate de que esté en **"Enable form detection"** (habilitado)

2. **Verifica el HTML generado**:
   - Ve a **Site overview** → **Deploys** → Haz clic en el último deploy
   - Descarga o revisa el archivo `_site/index.html` generado
   - Verifica que el formulario tenga el atributo `data-netlify="true"` y `method="POST"`
   - Si no lo tiene, el build no está procesando correctamente el formulario

3. **Haz un deploy limpio**:
   - Ve a **Site overview** → **Deploys**
   - Haz clic en **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Esto fuerza a Netlify a escanear el HTML desde cero

4. **Espera a que termine el build**:
   - Netlify escanea los formularios **durante el build**
   - Espera a que el deploy termine completamente (estado "Published")

5. **Envía un formulario de prueba**:
   - Ve a tu sitio desplegado (la URL de Netlify)
   - Rellena y envía el formulario de contacto
   - Verifica que aparezca el mensaje de éxito

6. **Revisa los envíos**:
   - Ve a **Site overview** → **Forms**
   - Si ves envíos en la lista, el formulario está funcionando
   - El formulario puede aparecer en la lista después del primer envío exitoso

7. **Si aún no aparece después de 5-10 minutos**:
   - Ve a **Site settings** → **Forms** → **Usage and configuration**
   - Verifica que no haya errores
   - Revisa los logs del build para ver si hay warnings sobre formularios

#### Paso 2: Configurar las notificaciones por email

Una vez que veas el formulario "contacto" en **Site settings** → **Forms**:

1. Haz clic en el formulario **"contacto"**
2. Ve a la pestaña **"Notifications"** o **"Form notifications"**
3. Haz clic en **"Add notification"**
4. Selecciona **"Email notification"**
5. Configura:
   - **To**: `juanpablo@ocelot.es`
   - **From**: (puedes dejarlo por defecto o usar un email personalizado)
   - **Subject**: `Nuevo mensaje de contacto - Cargo Alhama`
   - **Body**: Puedes personalizar el mensaje o usar el template por defecto
6. Guarda los cambios

**Nota**: Las notificaciones por email funcionan automáticamente una vez configuradas. También puedes ver todos los envíos del formulario en **Site overview** → **Forms** → **"contacto"**.

#### Si el formulario aún no aparece después de seguir todos los pasos:

**Verificación del HTML generado:**

1. **Descarga el HTML del deploy**:
   - Ve a **Site overview** → **Deploys** → Haz clic en el último deploy
   - Busca el archivo `index.html` en los archivos desplegados
   - O visita `https://tu-sitio.netlify.app/index.html` y ve el código fuente

2. **Busca el formulario en el HTML**:
   - Debe tener: `<form name="contacto" method="POST" data-netlify="true">`
   - Debe tener: `<input type="hidden" name="form-name" value="contacto">`
   - Si estos atributos no están, Eleventy no está procesando correctamente el template

3. **Si el formulario no está en el HTML generado**:
   - Verifica que `index.html` esté en la raíz del proyecto
   - Verifica que Eleventy esté procesando el archivo (revisa `.eleventy.js`)
   - Prueba hacer un build local: `npm run build` y revisa `_site/index.html`

**Otras soluciones:**

- **Deshabilita y vuelve a habilitar "Form detection"**:
  - Ve a **Site settings** → **Forms** → **Form detection**
  - Deshabilita, guarda, espera 1 minuto, vuelve a habilitar
  - Haz un nuevo deploy

- **Revisa los logs del build**:
  - Ve a **Site overview** → **Deploys** → Haz clic en el deploy
  - Busca mensajes sobre "Forms" o "form detection"
  - Si hay errores, corrígelos

- **Contacta con soporte de Netlify**:
  - Si nada funciona, puede ser un problema del lado de Netlify
  - Incluye los logs del build y el HTML generado

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
