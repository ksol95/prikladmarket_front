import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import imagemin from 'vite-plugin-imagemin';
import removeConsole from 'vite-plugin-remove-console';

// Кастомный плагин для удаления trailing slash у void элементов
function removeVoidElementTrailingSlashes() {
	return {
		name: 'remove-void-element-trailing-slashes',
		apply: 'build', // Применять только при сборке
		transformIndexHtml(html) {
			// Список void элементов HTML5
			const voidElements = [
				'area',
				'base',
				'br',
				'col',
				'embed',
				'hr',
				'img',
				'input',
				'link',
				'meta',
				'param',
				'source',
				'track',
				'wbr',
			];

			// Создаем регулярное выражение для всех void элементов
			const voidElementsPattern = voidElements.join('|');
			const regex = new RegExp(`<(${voidElementsPattern})([^>]*?)\\s*/>`, 'g');

			// Заменяем trailing slash на >
			return html.replace(regex, '<$1$2>');
		},
	};
}

export default defineConfig({
	base: '/prikladmarket_front/',
	server: {
		host: '0.0.0.0',
		port: 3000,
		// open: "/", // Можно оставить, но теперь он откроет src/index.html
		open: true, // Просто открыть, Vite сам найдет index.html
	},
	plugins: [
		removeVoidElementTrailingSlashes(),
		imagemin({
			gifsicle: { optimizationLevel: 7, interlaced: false },
			optipng: { optimizationLevel: 7 },
			mozjpeg: { quality: 85 },
			pngquant: { quality: [0.6, 0.8], speed: 4 },
			svgo: {
				plugins: [
					{ name: 'removeViewBox', active: false },
					{ name: 'removeEmptyAttrs', active: true },
				],
			},
		}),
		removeConsole({
			includes: ['log'], // Указывает, какие методы console удалять
			excludes: ['error', 'warn'], // Исключения (не будет удалять console.error)),
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
				main: resolve(__dirname, 'index.html'),
				catalog: resolve(__dirname, 'src/pages/catalog.html'),
				product: resolve(__dirname, 'src/pages/product.html'),
				contacts: resolve(__dirname, 'src/pages/contacts.html'),
				blog: resolve(__dirname, 'src/pages/blog.html'),
			},
			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1);
					if (/scss|css/i.test(extType)) {
						extType = 'css';
					} else if (/png|jpe?g|svg|gif|tiff|bmp|webp/i.test(extType)) {
						extType = 'images';
					} else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
						extType = 'fonts';
					} else {
						extType = 'misc'; // Для других ресурсов
					}
					return `assets/${extType}/[name]_[hash].[ext]`;
				},
			},
		},
	},
});
