module.exports = function(eleventyConfig) {
  // Copiar CSS, JS, imágenes al output (_site)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("imagenes");
  eleventyConfig.addPassthroughCopy("admin"); // Importante: incluir panel de Decap
  eleventyConfig.addPassthroughCopy("_data"); // Datos JSON/YAML
  
  // Ignorar scripts, node_modules y lenis-main
  eleventyConfig.ignores.add("scripts");
  eleventyConfig.ignores.add("node_modules");
  eleventyConfig.ignores.add("lenis-main");
  
  // Filtro para convertir ruta de imagen a WebP
  eleventyConfig.addFilter("toWebp", function(src) {
    if (!src) return src;
    // Normalizar: eliminar subcarpeta /optimized/ para unificar la lógica
    const normalized = src.replace('/imagenes/optimized/', '/imagenes/');
    return normalized
      .replace('/imagenes/', '/imagenes/webp/')
      .replace(/\.(png|jpg|jpeg)$/i, '.webp');
  });
  
  // Helper para generar imágenes WebP con fallback
  eleventyConfig.addShortcode("picture", function(src, alt, className = "", loading = "lazy") {
    const normalized = src.replace('/imagenes/optimized/', '/imagenes/');
    const webpSrc = normalized
      .replace('/imagenes/', '/imagenes/webp/')
      .replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    // Construir atributos de clase
    const classAttr = className ? ` class="${className}"` : '';
    
    return `<picture>
  <source srcset="${webpSrc}" type="image/webp">
  <img src="${src}" alt="${alt}"${classAttr} loading="${loading}">
</picture>`;
  });
  
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



