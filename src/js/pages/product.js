// Импортируем основные стили
import "../../scss/main.scss";
// Импортируем стили, специфичные для страницы
import "../../scss/pages/product.scss";
// Импортируем основные JS модули
import "../index.js";
// Импортируйте другие необходимые JS модули

console.log("Product page scripts loaded.");

document.addEventListener("DOMContentLoaded", () => {
  // --- Функция для создания/отображения модального окна ---
  const showModal = (attrListContent, attrTitleText) => {
    // 1. Создаем элементы модального окна
    const modalClass = "order-form__modal";
    let modal = document.getElementById("attr-modal");
    let modalContent = null;
    let modalTitle = null;
    let modalListContainer = null;
    let closeButton = null;
    let currentOriginalList = attrListContent; // Сохраняем ссылку на оригинальный список

    // Если модальное окно уже существует, очищаем его содержимое
    if (modal) {
      modalContent = modal.querySelector(`.${modalClass}-content`);
      modalTitle = modalContent.querySelector("h2"); // Предполагаем, что заголовок - h2
      modalListContainer = modalContent.querySelector(
        ".order-form__modal-list"
      );
      closeButton = modalContent.querySelector(`.${modalClass}-close`);
    } else {
      // Создаем модальное окно, если его еще нет
      modal = document.createElement("div");
      modal.id = "attr-modal";
      modal.className = modalClass; // Добавляем класс для стилизации

      modalContent = document.createElement("div");
      modalContent.className = `${modalClass}-content`;

      // Создаем заголовок модального окна
      modalTitle = document.createElement("h2"); // Используйте подходящий тег заголовка
      modalTitle.className = `${modalClass}-title`;
      // Заголовок будет установлен позже

      // Создаем контейнер для списка внутри модального окна
      modalListContainer = document.createElement("div");
      modalListContainer.className = `${modalClass}-list`;
      // Содержимое списка будет клонировано позже

      // Создаем кнопку закрытия
      closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = `${modalClass}-close`;
      closeButton.setAttribute("aria-label", "Закрыть");
      closeButton.innerHTML = "&times;"; // Или используйте иконку SVG

      // Собираем модальное окно
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(closeButton);
      modalContent.appendChild(modalListContainer);
      modal.appendChild(modalContent);

      // Добавляем модальное окно в тело документа
      document.body.appendChild(modal);

      // --- Обработчики событий для модального окна ---
      // Закрытие по клику на кнопку закрытия
      const closeModal = () => {
        // Синхронизируем состояние перед закрытием
        syncModalToOriginal(currentOriginalList, modalListContainer);

        modal.classList.remove("show");
        modal.classList.add("hide");
        setTimeout(() => {
          modal.remove();
          // Удаляем обработчики событий
          document.removeEventListener("keydown", modal.handleEscKey);
        }, 400);
      };

      closeButton.addEventListener("click", () => closeModal());

      // Закрытие по клику вне содержимого модального окна
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Закрытие по нажатию Escape
      const handleEscKey = (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
          closeModal();
        }
      };
      document.addEventListener("keydown", handleEscKey);
      // Сохраняем ссылку на обработчик
      modal.handleEscKey = handleEscKey;
    }

    // 2. Заполняем модальное окно содержимым
    // Клонируем содержимое оригинального списка
    const clonedListContent = attrListContent.cloneNode(true);
    // Удаляем кнопки .more-button из клонированного содержимого, если они там есть
    clonedListContent
      .querySelectorAll(".more-button")
      .forEach((btn) => btn.remove());

    // Очищаем контейнер и добавляем клонированное содержимое
    modalListContainer.innerHTML = ""; // Очищаем предыдущее содержимое
    modalListContainer.appendChild(clonedListContent);

    // Сохраняем ссылку на оригинальный список для синхронизации
    modal.currentOriginalList = currentOriginalList;

    // Устанавливаем заголовок модального окна
    modalTitle.textContent = attrTitleText || "Выберите опцию";
    modal.classList.add("show");
  };
  // --- Конец функции showModal ---

  // --- Функция для синхронизации состояния из модального окна в оригинальный список ---
  const syncModalToOriginal = (originalList, modalListContainer) => {
    // Находим клонированный список внутри модального окна
    const modalList =
      modalListContainer.querySelector(".order-form__attr-list") ||
      modalListContainer;

    if (!originalList || !modalList) {
      console.warn("Один из списков для синхронизации не найден");
      return;
    }

    // Получаем все элементы управления из оригинального списка
    const originalControls = originalList.querySelectorAll(
      'input[type="checkbox"], input[type="radio"], select, button.attr-button'
    );
    // Получаем все элементы управления из модального списка
    const modalControls = modalList.querySelectorAll(
      'input[type="checkbox"], input[type="radio"], select, button.attr-button'
    );

    // Синхронизируем состояние каждого элемента управления
    originalControls.forEach((originalControl, index) => {
      const modalControl = modalControls[index];

      if (!modalControl) {
        console.warn(
          `Элемент управления в модальном окне не найден для индекса ${index}`
        );
        return;
      }

      // Синхронизация для чекбоксов и радиокнопок
      if (
        originalControl.type === "checkbox" ||
        originalControl.type === "radio"
      ) {
        originalControl.checked = modalControl.checked;

        // Если это радиокнопка, обновляем визуальное состояние
        if (originalControl.type === "radio") {
          // Находим родительский элемент .attr-button
          const originalAttrButton = originalControl.closest(".attr-button");
          const modalAttrButton = modalControl.closest(".attr-button");

          if (originalAttrButton && modalAttrButton) {
            // Копируем классы активности
            if (modalAttrButton.classList.contains("active")) {
              originalAttrButton.classList.add("active");
            } else {
              originalAttrButton.classList.remove("active");
            }
          }
        }
      }

      // Синхронизация для кнопок .attr-button (если они меняют состояние)
      if (
        originalControl.classList &&
        originalControl.classList.contains("attr-button")
      ) {
        // Копируем классы активности
        originalControl.className = modalControl.className;
      }

      // Синхронизация для select
      if (originalControl.tagName === "SELECT") {
        originalControl.value = modalControl.value;
      }
    });

    // Вызываем событие изменения для обновления других частей интерфейса
    originalList.dispatchEvent(new Event("change", { bubbles: true }));
  };
  // --- Конец функции syncModalToOriginal ---

  const checkOverflow = () => {
    const orderForm = document.querySelector(".order-form");

    if (!orderForm) {
      console.warn("Элемент .order-form не найден на странице");
      return;
    }

    const attrElements = orderForm.querySelectorAll(".order-form__attr-list");

    attrElements.forEach((attrList, index) => {
      const attr = attrList.closest(".order-form__attr");

      if (!attr) {
        console.warn(
          `Родительский элемент .order-form__attr не найден для списка ${index}`
        );
        return;
      }

      if (attrList.scrollWidth > attrList.clientWidth) {
        attr.classList.add("overflow");

        let moreButton = attr.querySelector(".more-button");
        if (!moreButton) {
          moreButton = document.createElement("button");
          moreButton.type = "button";
          moreButton.className = "more-button";
          moreButton.textContent = "...";
          moreButton.setAttribute("aria-label", "Показать весь список");
          // ID может быть полезен, но не обязателен
          moreButton.id = `${index}-more-button`;

          attr.appendChild(moreButton);
        }
      } else {
        attr.classList.remove("overflow");

        const existingButton = attr.querySelector(".more-button");
        if (existingButton) {
          existingButton.remove();
        }
      }
    });
  };

  // Проверяем переполнение при загрузке страницы
  checkOverflow();

  // Также проверяем при изменении размера окна
  window.addEventListener("resize", checkOverflow);

  // --- Делегирование событий для кликов по .more-button ---
  document.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".more-button")) {
      e.preventDefault();

      const attr = e.target.closest(".order-form__attr");
      if (!attr) {
        console.error(
          "Кнопка .more-button не находится внутри .order-form__attr"
        );
        return;
      }

      const attrList = attr.querySelector(":scope > .order-form__attr-list");
      if (!attrList) {
        console.error(
          "Список .order-form__attr-list не найден внутри .order-form__attr"
        );
        return;
      }

      const attrTitleElement = attr.querySelector(".order-form__attr-title");
      const attrTitleText = attrTitleElement
        ? attrTitleElement.textContent.trim()
        : "";

      console.log("Содержимое списка для модального окна:", attrList);
      console.log("Заголовок группы:", attrTitleText);

      // Вызываем функцию показа модального окна
      showModal(attrList, attrTitleText);
    }
  });
  // --- Конец делегирования событий ---
});
