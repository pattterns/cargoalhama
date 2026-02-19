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
  
  // Filtro para convertir ruta PNG a WebP
  eleventyConfig.addFilter("toWebp", function(src) {
    if (!src) return src;
    return src.replace('.png', '.webp').replace('/imagenes/', '/imagenes/webp/');
  });
  
  // Helper para generar imágenes WebP con fallback PNG
  eleventyConfig.addShortcode("picture", function(src, alt, className = "", loading = "lazy") {
    // Convertir ruta PNG a WebP
    const webpSrc = src.replace('.png', '.webp').replace('/imagenes/', '/imagenes/webp/');
    
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



