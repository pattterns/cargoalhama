module.exports = function(eleventyConfig) {
  // Copiar CSS, JS, imágenes al output (_site)
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("imagenes");
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
