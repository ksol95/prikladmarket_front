/**
 * Функция для усечения хлебных крошек
 * Заменяет средние элементы на "..." пока содержимое не поместится
 */
const trimBreadcrumbs = () => {
	console.log("--- Начало усечения хлебных крошек ---");

	// Находим все навигации с хлебными крошками
	const breadcrumbNavs = document.querySelectorAll("nav.breadcrumb");

	breadcrumbNavs.forEach((nav, navIndex) => {
		console.log(`Обработка навигации ${navIndex + 1}:`, nav);

		// Находим список крошек внутри навигации
		const breadcrumbList = nav.querySelector(".breadcrumb__list");
		if (!breadcrumbList) {
			console.warn(
				`  Список .breadcrumb__list не найден в навигации ${navIndex + 1}`
			);
			return;
		}

		// Находим все элементы крошек (li)
		const breadcrumbItems = breadcrumbList.querySelectorAll(
			".breadcrumb__item:not(.breadcrumb__item--ellipsis)"
		);
		console.log(`  Найдено ${breadcrumbItems.length} элементов крошек`);

		// Если элементов меньше 3, усечение не требуется
		if (breadcrumbItems.length < 3) {
			console.log(`  Меньше 3 элементов, усечение не требуется`);
			return;
		}

		// Находим или создаем элемент для многоточия
		let ellipsisItem = breadcrumbList.querySelector(
			".breadcrumb__item--ellipsis"
		);
		if (!ellipsisItem) {
			ellipsisItem = document.createElement("li");
			ellipsisItem.className = "breadcrumb__item breadcrumb__item--ellipsis";
			ellipsisItem.innerHTML = '<span class="breadcrumb__item-link">...</span>';
			// Добавляем мета-тег для schema.org (опционально)
			// const metaPosition = document.createElement('meta');
			// metaPosition.setAttribute('itemprop', 'position');
			// metaPosition.setAttribute('content', '0'); // Позиция будет динамической
			// ellipsisItem.appendChild(metaPosition);
		}

		// Функция для проверки, помещается ли содержимое
		const isOverflowing = () => {
			// Сравниваем scrollWidth (полная ширина содержимого) с clientWidth (видимая ширина)
			return breadcrumbList.scrollWidth > breadcrumbList.clientWidth;
		};

		// Функция для сброса состояния (показать все, скрыть многоточие)
		const resetItems = () => {
			console.log("  Сброс состояния элементов");
			breadcrumbItems.forEach((item) => {
				item.classList.remove("hidden");
			});
			if (ellipsisItem && ellipsisItem.parentNode) {
				ellipsisItem.remove();
			}
		};

		// Сначала показываем все элементы
		resetItems();

		// Проверяем, нужно ли усечение
		if (!isOverflowing()) {
			console.log("  Содержимое помещается, усечение не требуется");
			return;
		}

		console.log("Содержимое не помещается, начинаем усечение");

		// Начинаем усечение: скрываем элементы по одному, начиная с середины
		// Всегда оставляем первый и последний элементы
		let startIndex = 1; // Начинаем со второго элемента
		let endIndex = breadcrumbItems.length - 2; // Заканчиваем предпоследним элементом

		// Пока содержимое не помещается и есть элементы для скрытия
		while (isOverflowing() && startIndex <= endIndex) {
			console.log(
				`  Попытка скрытия элементов: start=${startIndex}, end=${endIndex}`
			);

			// Скрываем элементы с обоих концов поочередно
			if (startIndex <= endIndex) {
				const startItem = breadcrumbItems[startIndex];
				const endItem = breadcrumbItems[endIndex];

				// Скрываем начальный элемент
				if (startItem && !startItem.classList.contains("hidden")) {
					console.log(`    Скрываем начальный элемент ${startIndex}`);
					startItem.classList.add("hidden");
				}

				// Скрываем конечный элемент, если он отличается от начального
				if (
					endItem &&
					endItem !== startItem &&
					!endItem.classList.contains("hidden")
				) {
					console.log(`    Скрываем конечный элемент ${endIndex}`);
					endItem.classList.add("hidden");
				}

				// Добавляем многоточие, если его еще нет
				if (!ellipsisItem.parentNode) {
					console.log("Добавляем элемент многоточия");
					// Вставляем многоточие после первого элемента
					breadcrumbList.insertBefore(ellipsisItem, breadcrumbItems[1]);
				}
			}

			// Переходим к следующей паре элементов
			startIndex++;
			endIndex--;

			// Небольшая задержка для отладки (можно удалить)
			// await new Promise(resolve => setTimeout(resolve, 10));
		}

		console.log("  Усечение завершено");
		console.log(`  Ширина списка: ${breadcrumbList.scrollWidth}px`);
		console.log(`  Видимая ширина: ${breadcrumbList.clientWidth}px`);
		console.log(`  Переполнение: ${isOverflowing() ? "Да" : "Нет"}`);
	});

	console.log("--- Конец усечения хлебных крошек ---");
};

// --- Инициализация и обработка событий ---

// Выполняем усечение при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM загружен, выполняем начальное усечение хлебных крошек");
	trimBreadcrumbs();
});

// Выполняем усечение при изменении размера окна
let resizeTimeout;
window.addEventListener("resize", () => {
	console.log("Window resized, планируем усечение хлебных крошек");
	// Используем debounce для оптимизации
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		console.log("Выполняем усечение хлебных крошек после изменения размера");
		trimBreadcrumbs();
	}, 150); // Задержка 150мс
});

console.log("Скрипт усечения хлебных крошек загружен");
