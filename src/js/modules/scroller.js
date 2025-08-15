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

    // Функция для проверки необходимости показа стрелок
    const checkArrowsVisibility = () => {
      // Проверяем, есть ли переполнение по горизонтали У СПИСКА
      if (list.scrollWidth > list.clientWidth) {
        grid.classList.add("show-arrows");

        // Проверяем, можно ли скроллить влево
        if (list.scrollLeft > 0) {
          grid.classList.add("show-left-arrow");
        } else {
          grid.classList.remove("show-left-arrow");
        }

        // Проверяем, можно ли скроллить вправо
        // Используем небольшую погрешность для вещественных чисел
        if (list.scrollLeft + list.clientWidth + 1 < list.scrollWidth) {
          grid.classList.add("show-right-arrow");
        } else {
          grid.classList.remove("show-right-arrow");
        }
      } else {
        // Если переполнения нет, скрываем все классы
        grid.classList.remove(
          "show-arrows",
          "show-left-arrow",
          "show-right-arrow"
        );
      }
    };

    // Инициальная проверка
    checkArrowsVisibility();
    const resizeObserver = new ResizeObserver(checkArrowsVisibility);
    resizeObserver.observe(grid);
    resizeObserver.observe(list);

    // Проверка при скролле внутри списка
    list.addEventListener("scroll", checkArrowsVisibility);

    // --- Улучшенные обработчики кликов по стрелкам ---
    const scrollToNextCard = (direction) => {
      // Находим все карточки внутри списка
      const cards = list.querySelectorAll(".products-grid__card");
      if (cards.length === 0) return;

      // Ширина видимой области
      const containerWidth = list.clientWidth;

      // Текущая позиция прокрутки
      const currentScrollLeft = list.scrollLeft;

      // Находим первую полностью видимую карточку
      let firstVisibleCardIndex = -1;
      let lastVisibleCardIndex = -1;

      // Проходим по всем карточкам, чтобы найти первую и последнюю видимые
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardRect = card.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();

        // Позиция карточки относительно списка
        const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
        const cardRight = cardLeft + cardRect.width;

        // Проверяем, если карточка полностью или частично видима
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

      // Если не нашли видимых карточек, используем первый/последний
      if (firstVisibleCardIndex === -1) {
        firstVisibleCardIndex = 0;
        lastVisibleCardIndex = 0;
      }

      let targetScrollLeft;

      if (direction === "right") {
        // Прокрутка вправо: находим следующую карточку после последней видимой
        const nextCardIndex = Math.min(
          lastVisibleCardIndex + 1,
          cards.length - 1
        );
        const nextCard = cards[nextCardIndex];
        if (nextCard) {
          const cardRect = nextCard.getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
          // Прокручиваем так, чтобы следующая карточка была в начале
          targetScrollLeft = cardLeft;
        } else {
          // Если следующей карточки нет, прокручиваем до конца
          targetScrollLeft = list.scrollWidth - containerWidth;
        }
      } else {
        // Прокрутка влево: находим предыдущую карточку перед первой видимой
        const prevCardIndex = Math.max(firstVisibleCardIndex - 1, 0);
        const prevCard = cards[prevCardIndex];
        if (prevCard) {
          const cardRect = prevCard.getBoundingClientRect();
          const listRect = list.getBoundingClientRect();
          const cardLeft = cardRect.left - listRect.left + currentScrollLeft;
          // Прокручиваем так, чтобы предыдущая карточка была в начале
          targetScrollLeft = cardLeft;
        } else {
          // Если предыдущей карточки нет, прокручиваем в начало
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

    // Обработчики кликов по стрелкам
    leftArrow.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToNextCard("left");
    });

    rightArrow.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToNextCard("right");
    });

    // Также добавим обработку клавиатуры для улучшения доступности
    grid.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToNextCard("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToNextCard("right");
      }
    });

    const wheelHandler = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) {
        e.preventDefault();

        // Удаляем обработчик
        grid.removeEventListener("wheel", wheelHandler, { passive: false });

        if (e.deltaX > 0) {
          scrollToNextCard("right");
        } else {
          scrollToNextCard("left");
        }

        // Добавляем обработчик обратно через задержку
        setTimeout(() => {
          grid.addEventListener("wheel", wheelHandler, { passive: false });
        }, 400);
      }
    };

    grid.addEventListener("wheel", wheelHandler, { passive: false });
  });
});
