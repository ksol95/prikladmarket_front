import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import imagemin from "vite-plugin-imagemin";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 3000,
    // open: "/", // Можно оставить, но теперь он откроет src/index.html
    open: true, // Просто открыть, Vite сам найдет index.html
  },
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 85 },
      pngquant: { quality: [0.6, 0.8], speed: 4 },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "removeEmptyAttrs", active: true },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Теперь main указывает на корневой index.html
        main: resolve(__dirname, "src/index.html"),
        catalog: resolve(__dirname, "src/pages/catalog.html"),
        product: resolve(__dirname, "src/pages/product.html"),
        product: resolve(__dirname, "src/pages/contacts.html"),
        product: resolve(__dirname, "src/pages/blog.html"),
      },
      output: {
        // Исправлено: нельзя иметь два assetFileNames. Объединим логику.
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|webp/i.test(extType)) {
            extType = "images";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          } else {
            extType = "misc"; // Для других ресурсов
          }
          return `assets/${extType}/[name].[ext]`;
        },
        entryFileNames: "assets/js/[name].[hash].js", // Добавлен hash для кэширования
        chunkFileNames: "assets/js/[name].[hash].js", // Добавлен hash для кэширования
        // assetFileNames: "assets/[name].[ext]", // Удалено, т.к. дублируется
      },
    },
  },
});
