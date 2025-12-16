# Guía de Implementación WebP

## 📋 Pasos para Implementar WebP en el Sitio

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar Optimización

```bash
# Optimizar todas las imágenes (PNG + WebP)
npm run optimize:images

# Solo convertir a WebP
npm run optimize:webp

# Solo optimizar PNGs
npm run optimize:png
```

### 3. Actualizar Templates HTML

Después de generar las imágenes WebP, necesitas actualizar los templates para usar el formato `<picture>` con fallback.

#### Ejemplo: Hero Section

**Antes:**
```html
<img src="{% raw %}{{ hero.image }}{% endraw %}" alt="Cargo Alhama" class="hero-bg-image">
```

**Después:**
```html
<picture>
  <source srcset="{% raw %}{{ hero.image | replace: '.png', '.webp' | replace: '/imagenes/', '/imagenes/webp/' }}{% endraw %}" type="image/webp">
  <img src="{% raw %}{{ hero.image }}{% endraw %}" alt="Cargo Alhama" class="hero-bg-image" loading="eager">
</picture>
```

#### Ejemplo: Servicios

**Antes:**
```html
<img src="{% raw %}{{ service.image }}{% endraw %}" alt="{% raw %}{{ service.alt }}{% endraw %}">
```

**Después:**
```html
<picture>
  <source srcset="{% raw %}{{ service.image | replace: '.png', '.webp' | replace: '/imagenes/', '/imagenes/webp/' }}{% endraw %}" type="image/webp">
  <img src="{% raw %}{{ service.image }}{% endraw %}" alt="{% raw %}{{ service.alt }}{% endraw %}" loading="lazy">
</picture>
```

#### Ejemplo: Galería (ya tiene lazy loading)

**Antes:**
```html
<img src="{% raw %}{{ item.image }}{% endraw %}" alt="{% raw %}{{ item.alt }}{% endraw %}" loading="lazy">
```

**Después:**
```html
<picture>
  <source srcset="{% raw %}{{ item.image | replace: '.png', '.webp' | replace: '/imagenes/', '/imagenes/webp/' }}{% endraw %}" type="image/webp">
  <img src="{% raw %}{{ item.image }}{% endraw %}" alt="{% raw %}{{ item.alt }}{% endraw %}" loading="lazy">
</picture>
```

### 4. Helper de Eleventy (Opcional pero Recomendado)

Puedes crear un helper en `.eleventy.js` para simplificar el código:

```javascript
eleventyConfig.addShortcode("picture", function(src, alt, className = "", loading = "lazy") {
  const webpSrc = src.replace('.png', '.webp').replace('/imagenes/', '/imagenes/webp/');
  return `<picture>
    <source srcset="${webpSrc}" type="image/webp">
    <img src="${src}" alt="${alt}" class="${className}" loading="${loading}">
  </picture>`;
});
```

**Uso:**
```html
{% raw %}{% picture service.image service.alt "service-image-numbered" "lazy" %}{% endraw %}
```

### 5. Verificar Resultados

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Filtra por "Img"
5. Verifica que se carguen archivos `.webp`
6. Comprueba la reducción de tamaño

### 6. Testing

- ✅ Probar en Chrome/Edge (soporte completo WebP)
- ✅ Probar en Firefox (soporte completo WebP)
- ✅ Probar en Safari (soporte completo WebP desde 14.0)
- ✅ Verificar fallback en navegadores antiguos
- ✅ Probar en dispositivos móviles
- ✅ Verificar calidad visual

### 7. Actualizar .gitignore (Opcional)

Si no quieres versionar las imágenes optimizadas:

```gitignore
# Imágenes optimizadas (se generan automáticamente)
imagenes/webp/
imagenes/optimized/
```

---

## 🎯 Beneficios Esperados

- **Reducción de tamaño**: 70-90% menos peso
- **Mejor rendimiento**: Carga más rápida
- **Mejor SEO**: Google valora la velocidad
- **Mejor UX**: Menos tiempo de espera
- **Ahorro de ancho de banda**: Especialmente importante en móviles

---

## ⚠️ Notas Importantes

1. **Mantener originales**: No elimines las imágenes PNG originales (son el fallback)
2. **Backup**: Haz backup antes de optimizar
3. **Calidad**: Ajusta la calidad en el script si las imágenes se ven mal
4. **Testing**: Siempre prueba visualmente después de optimizar

---

## 🔧 Ajustes de Calidad

Si las imágenes WebP no tienen suficiente calidad, edita `scripts/optimize-images.js`:

```javascript
const SIZE_CONFIG = {
  hero: { maxWidth: 1920, quality: 90 }, // Aumentar de 85 a 90
  // ...
};
```

