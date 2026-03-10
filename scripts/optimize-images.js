#!/usr/bin/env node

/**
 * Script de optimización de imágenes para Cargo Alhama
 * 
 * Este script:
 * 1. Optimiza imágenes PNG existentes
 * 2. Convierte a WebP
 * 3. Redimensiona según el tipo de imagen
 * 
 * Uso: node scripts/optimize-images.js [--webp] [--resize] [--optimize]
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGENES_DIR = path.join(__dirname, '..', 'imagenes');
const WEBP_DIR = path.join(__dirname, '..', 'imagenes', 'webp');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'imagenes', 'optimized');

// Configuración de tamaños según tipo de imagen
const SIZE_CONFIG = {
  hero: { maxWidth: 1920, quality: 85 },
  service: { maxWidth: 1200, quality: 85 },
  gallery: { maxWidth: 800, quality: 85 },
  client: { maxWidth: 300, quality: 90 },
  logo: { maxWidth: 400, quality: 90 },
  default: { maxWidth: 1200, quality: 85 }
};

// Clasificar imágenes por tipo
function classifyImage(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('hero') || name.includes('internacional') ||
      name.includes('volvo') || name.includes('fachada') || name.includes('nueva')) {
    return 'hero';
  }
  if (name.includes('nacional') || name.includes('almacen') || 
      name.includes('warehouse') || name.includes('camiones') || 
      name.includes('flota') || name.includes('colaboradores') ||
      name.includes('sede') || name.includes('oficina') || name.includes('camion')) {
    return 'service';
  }
  if (name.includes('clientes') || name.includes('cliente')) {
    return 'client';
  }
  if (name.includes('logo')) {
    return 'logo';
  }
  return 'default';
}

// Obtener todas las imágenes PNG y JPG
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'webp' && item.name !== 'optimized') {
      files.push(...getImageFiles(fullPath));
    } else if (item.isFile() && /\.(png|jpg|jpeg)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Optimizar imagen (PNG o JPG)
async function optimizeImage(inputPath, outputPath) {
  try {
    const config = SIZE_CONFIG[classifyImage(path.basename(inputPath))];
    const ext = path.extname(inputPath).toLowerCase();
    const outputExt = path.extname(outputPath).toLowerCase();
    
    let pipeline = sharp(inputPath)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    
    if (outputExt === '.png') {
      pipeline = pipeline.png({
        quality: config.quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else if (outputExt === '.jpg' || outputExt === '.jpeg') {
      pipeline = pipeline.jpeg({
        quality: config.quality,
        progressive: true,
        mozjpeg: true
      });
    }
    
    await pipeline.toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    return {
      success: true,
      originalSize,
      optimizedSize,
      reduction: `${reduction}%`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Convertir a WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    const config = SIZE_CONFIG[classifyImage(path.basename(inputPath))];
    
    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({
        quality: config.quality,
        effort: 6
      })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    return {
      success: true,
      originalSize,
      webpSize,
      reduction: `${reduction}%`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const doWebP = args.includes('--webp') || args.includes('--all');
  const doResize = args.includes('--resize') || args.includes('--all');
  const doOptimize = args.includes('--optimize') || args.includes('--all');
  const doAll = args.includes('--all') || args.length === 0;

  console.log('🖼️  Optimizador de Imágenes - Cargo Alhama\n');
  console.log('Opciones activadas:');
  console.log(`  - Optimizar PNG: ${doOptimize || doAll ? '✅' : '❌'}`);
  console.log(`  - Convertir a WebP: ${doWebP || doAll ? '✅' : '❌'}`);
  console.log(`  - Redimensionar: ${doResize || doAll ? '✅' : '❌'}\n`);

  // Crear directorios si no existen
  if (doWebP || doAll) {
    if (!fs.existsSync(WEBP_DIR)) {
      fs.mkdirSync(WEBP_DIR, { recursive: true });
    }
  }
  
  if (doOptimize || doAll) {
    if (!fs.existsSync(OPTIMIZED_DIR)) {
      fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
    }
  }

  const images = getImageFiles(IMAGENES_DIR);
  console.log(`📁 Encontradas ${images.length} imágenes (PNG/JPG)\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalWebPSize = 0;
  const results = [];

  for (const imagePath of images) {
    const relativePath = path.relative(IMAGENES_DIR, imagePath);
    const ext = path.extname(imagePath);
    const filename = path.basename(imagePath, ext);
    const dir = path.dirname(relativePath);
    const imageType = classifyImage(filename);
    
    console.log(`📸 Procesando: ${relativePath} (${imageType})`);
    
    const stats = fs.statSync(imagePath);
    totalOriginalSize += stats.size;

    // Optimizar imagen
    if (doOptimize || doAll) {
      const optimizedPath = path.join(
        OPTIMIZED_DIR,
        dir !== '.' ? dir : '',
        `${filename}${ext}`
      );
      
      // Crear subdirectorio si es necesario
      const optimizedDir = path.dirname(optimizedPath);
      if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
      }
      
      const result = await optimizeImage(imagePath, optimizedPath);
      if (result.success) {
        totalOptimizedSize += result.optimizedSize;
        console.log(`   ✅ Imagen optimizada: ${(result.optimizedSize / 1024 / 1024).toFixed(2)} MB (reducción: ${result.reduction})`);
        results.push({
          file: relativePath,
          type: 'Optimized',
          reduction: result.reduction
        });
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
    }

    // Convertir a WebP
    if (doWebP || doAll) {
      const webpPath = path.join(
        WEBP_DIR,
        dir !== '.' ? dir : '',
        `${filename}.webp`
      );
      
      // Crear subdirectorio si es necesario
      const webpDir = path.dirname(webpPath);
      if (!fs.existsSync(webpDir)) {
        fs.mkdirSync(webpDir, { recursive: true });
      }
      
      const result = await convertToWebP(imagePath, webpPath);
      if (result.success) {
        totalWebPSize += result.webpSize;
        console.log(`   ✅ WebP creado: ${(result.webpSize / 1024 / 1024).toFixed(2)} MB (reducción: ${result.reduction})`);
        results.push({
          file: relativePath,
          type: 'WebP',
          reduction: result.reduction
        });
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
    }
    
    console.log('');
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('='.repeat(60));
  console.log(`Tamaño original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (doOptimize || doAll) {
    const pngReduction = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    console.log(`Tamaño PNG optimizado: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB (reducción: ${pngReduction}%)`);
  }
  
  if (doWebP || doAll) {
    const webpReduction = ((1 - totalWebPSize / totalOriginalSize) * 100).toFixed(1);
    console.log(`Tamaño WebP total: ${(totalWebPSize / 1024 / 1024).toFixed(2)} MB (reducción: ${webpReduction}%)`);
  }
  
  console.log('\n✅ Optimización completada!\n');
  console.log('💡 Próximos pasos:');
  console.log('   1. Revisa las imágenes optimizadas en: imagenes/optimized/');
  console.log('   2. Revisa las imágenes WebP en: imagenes/webp/');
  console.log('   3. Actualiza el HTML para usar WebP con fallback PNG');
  console.log('   4. Prueba el sitio y verifica la calidad visual\n');
}

// Ejecutar
main().catch(console.error);




