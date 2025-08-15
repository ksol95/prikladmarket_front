// Функция для обработки события прокрутки колеса мыши
function handleWheelScroll(event) {
  // Проверяем, является ли цель события (или его родитель) элементом с классом .scrolling
  const scrollingElement = event.currentTarget; // element, к которому прикреплен обработчик

  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    const deltaMultiplier = 1; // Можно настроить скорость прокрутки (например, 2 для удвоения)
    event.preventDefault();

    scrollingElement.scrollLeft += event.deltaY * deltaMultiplier;
  }
}

// Найдем все элементы с классом .scrolling на странице
const scrollingElements = document.querySelectorAll(".scrolling");

// Добавим обработчик события 'wheel' родителю каждого найденного элемента
scrollingElements.forEach((element) => {
  element.addEventListener("wheel", handleWheelScroll, {
    passive: false,
  }); // passive: false обязательно для event.preventDefault()
});

// --- JavaScript для управления стрелками и скроллом ---

document.addEventListener("DOMContentLoaded", () => {
  console.log("Инициализация скроллера с кнопками");

  const scrollingSlider = document.querySelectorAll(".scrolling-slider");

  scrollingSlider.forEach((grid) => {
    const list = grid.querySelector(".products-grid__list");
    if (!list) return;
    list.classList.add("scrolling");

    // --- Создание стрелок ---
    let leftArrow = grid.querySelector(".products-grid__arrow--left");
    let rightArrow = grid.querySelector(".products-grid__arrow--right");

    if (!leftArrow) {
      leftArrow = document.createElement("button");
      leftArrow.type = "button"; // Явно указываем тип
      leftArrow.className = "products-grid__arrow products-grid__arrow--left";
      leftArrow.setAttribute("aria-label", "Прокрутить влево");
      // Добавляем стрелку в DOM, например, в начало grid
      grid.prepend(leftArrow);
    }

    if (!rightArrow) {
      rightArrow = document.createElement("button");
      rightArrow.type = "button";
      rightArrow.className = "products-grid__arrow products-grid__arrow--right";
      rightArrow.setAttribute("aria-label", "Прокрутить вправо");
      // Добавляем стрелку в DOM, например, в конец grid
      grid.append(rightArrow);
    }
    // --- Конец создания стрелок ---

    // Функция для проверки необходимости показа стрелок
    const checkArrowsVisibility = () => {
      // console.log("Проверка видимости стрелок для:", grid);

      // Проверяем, есть ли переполнение по горизонтали У СПИСКА

      if (list.scrollWidth > list.clientWidth) {
        // console.log("Есть переполнение");
        grid.classList.add("show-arrows"); // Показываем контейнер стрелок

        // Проверяем, можно ли скроллить влево
        if (list.scrollLeft > 0) {
          grid.classList.add("show-left-arrow");
          // console.log("Можно скроллить влево");
        } else {
          grid.classList.remove("show-left-arrow");
        }

        // Проверяем, можно ли скроллить вправо
        // Используем небольшую погрешность для вещественных чисел
        // ВАЖНО: правильное условие проверки возможности прокрутки вправо
        if (list.scrollLeft + list.clientWidth + 1 < list.scrollWidth) {
          // if (Math.ceil(list.scrollLeft + list.clientWidth) < Math.floor(list.scrollWidth)) { // Альтернативная проверка
          grid.classList.add("show-right-arrow");
          // console.log("Можно скроллить вправо");
        } else {
          grid.classList.remove("show-right-arrow");
        }
      } else {
        // console.log("Нет переполнения, скрываем все");
        // Если переполнения нет, скрываем все классы
        grid.classList.remove(
          "show-arrows",
          "show-left-arrow",
          "show-right-arrow"
        );
      }
    };

    // Инициальная проверка при загрузке и после изменений размера
    checkArrowsVisibility(); // Проверяем сразу после создания стрелок
    const resizeObserver = new ResizeObserver(checkArrowsVisibility);
    resizeObserver.observe(grid);
    resizeObserver.observe(list);
    // window.addEventListener("resize", checkArrowsVisibility); // ResizeObserver предпочтительнее

    // Проверка при скролле внутри списка
    list.addEventListener("scroll", checkArrowsVisibility);

    // --- Обработчики кликов по стрелкам ---
    leftArrow.addEventListener("click", (e) => {
      e.preventDefault();

      const scrollAmount = grid.clientWidth * 1;
      list.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkArrowsVisibility, 300); // Учитываем длительность 'smooth'
    });

    rightArrow.addEventListener("click", (e) => {
      e.preventDefault();

      const scrollAmount = grid.clientWidth * 1;
      list.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkArrowsVisibility, 300);
    });
  }); // forEach productGrids
});
