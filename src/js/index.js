// Тут импортируются JS модули для всех страниц
import "./modules/set-theme.js";
// import "./modules/dropdown.js";
// import "./modules/header-menu.js";
import "./modules/scroller.js";

// Находим все элементы, которые нужно скрывать при переполнении родителя
const hideOnParentOverflowB = document.querySelectorAll(
  ".hideOnParentOverflow-b"
);
const hideOnParentOverflowI = document.querySelectorAll(
  ".hideOnParentOverflow-i"
);

/**
 * Функция для проверки переполнения и управления видимостью элементов
 */
const checkOverflow = () => {
  // Проверяем элементы, зависящие от вертикального переполнения (Block)
  hideOnParentOverflowB.forEach((item, index) => {
    const parent = item.parentElement;
    item.classList.remove("visually-hidden");
    if (!parent) {
      console.warn(
        `Элемент ${index} (.hideOnParentOverflow-b) не имеет родителя.`
      );
      return;
    }

    console.log(`Элемент B ${index}:`);
    console.log(`  Parent scrollHeight: ${parent.scrollHeight}`);
    console.log(`  Parent clientHeight: ${parent.clientHeight}`);

    // Если есть вертикальное переполнение (содержимое выходит за границы по высоте)
    parent.scrollHeight > parent.clientHeight
      ? item.classList.add("visually-hidden")
      : item.classList.remove("visually-hidden");
  });

  // Проверяем элементы, зависящие от горизонтального переполнения (Inline)
  hideOnParentOverflowI.forEach((item, index) => {
    const parent = item.parentElement;
    item.classList.remove("visually-hidden");

    if (!parent) {
      console.warn(
        `Элемент ${index} (.hideOnParentOverflow-i) не имеет родителя.`
      );
      return;
    }

    console.log(`Элемент I ${index}:`);
    console.log(`  Parent scrollWidth: ${parent.scrollWidth}`);
    console.log(`  Parent clientWidth: ${parent.clientWidth}`);

    // Если есть горизонтальное переполнение (содержимое выходит за границы по ширине)
    parent.scrollWidth > parent.clientWidth
      ? item.classList.add("visually-hidden")
      : item.classList.remove("visually-hidden");
  });
};

// Выполняем проверку при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  checkOverflow();
});

// Повторяем проверку при изменении размера окна
window.addEventListener("resize", () => {
  checkOverflow();
});
