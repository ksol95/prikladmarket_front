import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import imagemin from "vite-plugin-imagemin";

export default defineConfig({
	server: {
    host: '0.0.0.0', // Слушать все сетевые интерфейсы
    port: 3000,       // Порт (по умолчанию 3000)
    open: true,       // Автоматически открывать браузер при запуске
  },
  // Настройка плагинов
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

  // Настройка CSS
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },

  // Настройка сборки
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]", // Сохранение структуры файлов
      },
    },
  },
});
