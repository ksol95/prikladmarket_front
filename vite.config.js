import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import imagemin from "vite-plugin-imagemin";
import { resolve } from "path";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
  base: "/prikladmarket_front/",
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
    removeConsole({
      includes: ["log"], // Указывает, какие методы console удалять
      excludes: ["error", "warn"], // Исключения (не будет удалять console.error)),
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
        main: resolve(__dirname, "index.html"),
        catalog: resolve(__dirname, "src/pages/catalog.html"),
        product: resolve(__dirname, "src/pages/product.html"),
        contacts: resolve(__dirname, "src/pages/contacts.html"),
        blog: resolve(__dirname, "src/pages/blog.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/scss|css/i.test(extType)) {
            extType = "css";
          } else if (/png|jpe?g|svg|gif|tiff|bmp|webp/i.test(extType)) {
            extType = "images";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          } else {
            extType = "misc"; // Для других ресурсов
          }
          return `assets/${extType}/[name]_[hash].[ext]`;
        },
      },
    },
  },
});
