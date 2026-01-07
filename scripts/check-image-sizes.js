#!/usr/bin/env node

/**
 * Script para verificar tamaños de imágenes
 * Compara imágenes originales vs optimizadas vs WebP
 */

const fs = require('fs');
const path = require('path');

const IMAGENES_DIR = path.join(__dirname, '..', 'imagenes');
const WEBP_DIR = path.join(__dirname, '..', 'imagenes', 'webp');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'imagenes', 'optimized');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath).size;
    }
  } catch (error) {
    // Ignorar errores
  }
  return 0;
}

function getAllImages(dir, baseDir = dir) {
  const images = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (item.isDirectory() && item.name !== 'webp' && item.name !== 'optimized') {
      images.push(...getAllImages(fullPath, baseDir));
    } else if (item.isFile() && item.name.toLowerCase().endsWith('.png')) {
      images.push(relativePath);
    }
  }
  
  return images;
}

function main() {
  console.log('📊 Verificación de Tamaños de Imágenes\n');
  console.log('='.repeat(80));
  
  const images = getAllImages(IMAGENES_DIR);
  
  if (images.length === 0) {
    console.log('No se encontraron imágenes PNG en el directorio imagenes/');
    return;
  }
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalWebP = 0;
  let optimizedCount = 0;
  let webpCount = 0;
  
  const results = [];
  
  for (const image of images) {
    const originalPath = path.join(IMAGENES_DIR, image);
    const optimizedPath = path.join(OPTIMIZED_DIR, image);
    const webpPath = path.join(WEBP_DIR, image.replace('.png', '.webp'));
    
    const originalSize = getFileSize(originalPath);
    const optimizedSize = getFileSize(optimizedPath);
    const webpSize = getFileSize(webpPath);
    
    totalOriginal += originalSize;
    if (optimizedSize > 0) {
      totalOptimized += optimizedSize;
      optimizedCount++;
    }
    if (webpSize > 0) {
      totalWebP += webpSize;
      webpCount++;
    }
    
    results.push({
      image,
      originalSize,
      optimizedSize,
      webpSize
    });
  }
  
  // Mostrar tabla
  console.log('\n📁 Archivo'.padEnd(50) + 'Original'.padEnd(15) + 'Optimizado'.padEnd(15) + 'WebP'.padEnd(15));
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const original = formatBytes(result.originalSize);
    const optimized = result.optimizedSize > 0 ? formatBytes(result.optimizedSize) : 'N/A';
    const webp = result.webpSize > 0 ? formatBytes(result.webpSize) : 'N/A';
    
    const filename = result.image.length > 45 ? '...' + result.image.slice(-42) : result.image;
    console.log(filename.padEnd(50) + original.padEnd(15) + optimized.padEnd(15) + webp.padEnd(15));
  }
  
  // Resumen
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN');
  console.log('='.repeat(80));
  console.log(`Total de imágenes: ${images.length}`);
  console.log(`\nTamaño original total: ${formatBytes(totalOriginal)}`);
  
  if (optimizedCount > 0) {
    const pngReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log(`PNG optimizado (${optimizedCount} archivos): ${formatBytes(totalOptimized)}`);
    console.log(`  Reducción: ${pngReduction}%`);
    console.log(`  Ahorro: ${formatBytes(totalOriginal - totalOptimized)}`);
  } else {
    console.log('PNG optimizado: No disponible (ejecuta: npm run optimize:png)');
  }
  
  if (webpCount > 0) {
    const webpReduction = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);
    console.log(`WebP (${webpCount} archivos): ${formatBytes(totalWebP)}`);
    console.log(`  Reducción: ${webpReduction}%`);
    console.log(`  Ahorro: ${formatBytes(totalOriginal - totalWebP)}`);
  } else {
    console.log('WebP: No disponible (ejecuta: npm run optimize:webp)');
  }
  
  if (optimizedCount > 0 || webpCount > 0) {
    const bestSize = Math.min(
      totalOptimized || Infinity,
      totalWebP || Infinity
    );
    const bestReduction = ((1 - bestSize / totalOriginal) * 100).toFixed(1);
    console.log(`\n✨ Mejor opción disponible: ${formatBytes(bestSize)} (reducción: ${bestReduction}%)`);
  }
  
  console.log('\n');
}

main();



