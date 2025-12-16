# 🚀 Inicio Rápido - Optimización de Imágenes

## ⚡ Comandos Rápidos

```bash
# 1. Instalar dependencias
npm install

# 2. Verificar tamaños actuales
npm run check:sizes

# 3. Optimizar todas las imágenes (recomendado)
npm run optimize:images

# 4. Verificar resultados
npm run check:sizes
```

## 📋 Pasos Detallados

### Paso 1: Instalar
```bash
npm install
```
Esto instalará `sharp`, la herramienta de procesamiento de imágenes.

### Paso 2: Ver Estado Actual
```bash
npm run check:sizes
```
Muestra el tamaño actual de todas las imágenes.

### Paso 3: Optimizar
```bash
# Opción A: Todo (PNG optimizado + WebP)
npm run optimize:images

# Opción B: Solo WebP
npm run optimize:webp

# Opción C: Solo PNG optimizado
npm run optimize:png
```

### Paso 4: Revisar Resultados
Las imágenes optimizadas estarán en:
- `imagenes/optimized/` - PNGs optimizados
- `imagenes/webp/` - Versiones WebP

### Paso 5: Implementar en el Sitio
Ver guía completa en: `IMPLEMENTACION_WEBP.md`

## 📚 Documentación Completa

- **RESUMEN_OPTIMIZACION.md** - Resumen de todas las opciones
- **OPTIMIZACION_IMAGENES.md** - Guía detallada de opciones
- **IMPLEMENTACION_WEBP.md** - Cómo implementar WebP en HTML

## ⚠️ Importante

1. **Haz backup** antes de optimizar:
   ```bash
   cp -r imagenes imagenes_backup
   ```

2. **Revisa visualmente** las imágenes optimizadas antes de usarlas

3. **Mantén los originales** como fallback para navegadores antiguos

## 🎯 Resultado Esperado

- **Antes**: ~70 MB
- **Después**: ~7-10 MB (con WebP)
- **Reducción**: 85-90%
- **Tiempo de carga**: De 10-15 seg a 2-3 seg (3G)

---

**¿Listo?** Ejecuta `npm install` y luego `npm run optimize:images` 🎉

