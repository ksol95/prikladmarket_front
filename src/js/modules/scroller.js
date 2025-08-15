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

  const scrollingSliders = document.querySelectorAll(".scrolling-slider");

  scrollingSliders.forEach((grid) => {
    const list = grid.querySelector(".products-grid__list");
    if (!list) return;
    list.classList.add("scrolling");

    // --- Создание стрелок ---
    let leftArrow = grid.querySelector(".products-grid__arrow--left");
    let rightArrow = grid.querySelector(".products-grid__arrow--right");

    if (!leftArrow) {
      leftArrow = document.createElement("button");
      leftArrow.type = "button";
      leftArrow.className = "products-grid__arrow products-grid__arrow--left";
      leftArrow.setAttribute("aria-label", "Прокрутить влево");
      grid.prepend(leftArrow);
    }

    if (!rightArrow) {
      rightArrow = document.createElement("button");
      rightArrow.type = "button";
      rightArrow.className = "products-grid__arrow products-grid__arrow--right";
      rightArrow.setAttribute("aria-label", "Прокрутить вправо");
      grid.append(rightArrow);
    }
    // --- Конец создания стрелок ---

    // --- Функция для прокрутки к следующей карточке ---
    const scrollToNextCard = (direction) => {
      // Находим все карточки внутри списка
      const cards = list.querySelectorAll(".products-grid__card");
      if (cards.length === 0) return;

      const containerWidth = list.clientWidth;
      const currentScrollLeft = list.scrollLeft;

      let firstVisibleCardIndex = -1;
      let lastVisibleCardIndex = -1;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardRect = card.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();

        const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
        const cardRight = cardLeft + cardRect.width;

        if (
          cardLeft < currentScrollLeft + containerWidth &&
          cardRight > currentScrollLeft
        ) {
          if (firstVisibleCardIndex === -1) {
            firstVisibleCardIndex = i;
          }
          lastVisibleCardIndex = i;
        }
      }

      if (firstVisibleCardIndex === -1) {
        firstVisibleCardIndex = 0;
        lastVisibleCardIndex = 0;
      }

      let targetScrollLeft;

      if (direction === "right") {
        const nextCardIndex = Math.min(
          lastVisibleCardIndex + 1,
          cards.length - 1
        );
        const nextCard = cards[nextCardIndex];
        if (nextCard) {
          const cardRect = nextCard.getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
          targetScrollLeft = cardLeft;
        } else {
          targetScrollLeft = list.scrollWidth - containerWidth;
        }
      } else {
        const prevCardIndex = Math.max(firstVisibleCardIndex - 1, 0);
        const prevCard = cards[prevCardIndex];
        if (prevCard) {
          const cardRect = prevCard.getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
          targetScrollLeft = cardLeft;
        } else {
          targetScrollLeft = 0;
        }
      }

      // Выполняем плавную прокрутку
      list.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });

      // Обновляем состояние стрелок после прокрутки
      setTimeout(checkArrowsVisibility, 300);
    };
    // --- Конец функции scrollToNextCard ---

    // --- Функция для проверки необходимости показа стрелок ---
    const checkArrowsVisibility = () => {
      if (list.scrollWidth > list.clientWidth) {
        grid.classList.add("show-arrows");

        if (list.scrollLeft > 0) {
          grid.classList.add("show-left-arrow");
        } else {
          grid.classList.remove("show-left-arrow");
        }

        if (list.scrollLeft + list.clientWidth + 1 < list.scrollWidth) {
          grid.classList.add("show-right-arrow");
        } else {
          grid.classList.remove("show-right-arrow");
        }
      } else {
        grid.classList.remove(
          "show-arrows",
          "show-left-arrow",
          "show-right-arrow"
        );
      }
    };
    // --- Конец функции checkArrowsVisibility ---

    // Инициальная проверка
    checkArrowsVisibility();
    const resizeObserver = new ResizeObserver(checkArrowsVisibility);
    resizeObserver.observe(grid);
    resizeObserver.observe(list);
    list.addEventListener("scroll", checkArrowsVisibility);

    // --- Обработчики событий ---

    // 1. Создаем обработчик wheel с возможностью его отключения
    let isWheelHandlerActive = true;

    const wheelHandler = (e) => {
      if (!isWheelHandlerActive) return; // Игнорируем, если обработчик "отключен"

      // Проверяем, что прокрутка преимущественно горизонтальная
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) {
        e.preventDefault();

        // Отключаем обработчик на время выполнения scrollToNextCard
        isWheelHandlerActive = false;

        if (e.deltaX > 0) {
          scrollToNextCard("right");
        } else {
          scrollToNextCard("left");
        }

        // Включаем обработчик обратно через небольшую задержку,
        // чтобы дать время завершиться анимации прокрутки
        setTimeout(() => {
          isWheelHandlerActive = true;
        }, 400); // 400ms чуть больше, чем стандартная длительность 'smooth' (300ms)
      }
    };

    // 2. Добавляем обработчик wheel
    grid.addEventListener("wheel", wheelHandler, { passive: false });

    // 3. Обработчики кликов по стрелкам
    leftArrow.addEventListener("click", (e) => {
      e.preventDefault();

      // Отключаем обработчик wheel
      isWheelHandlerActive = false;

      scrollToNextCard("left");

      // Включаем обработчик wheel обратно
      setTimeout(() => {
        isWheelHandlerActive = true;
      }, 400);
    });

    rightArrow.addEventListener("click", (e) => {
      e.preventDefault();

      // Отключаем обработчик wheel
      isWheelHandlerActive = false;

      scrollToNextCard("right");

      // Включаем обработчик wheel обратно
      setTimeout(() => {
        isWheelHandlerActive = true;
      }, 400);
    });

    // --- Конец обработчиков событий ---
  });
});
