// Функция для обработки события прокрутки колеса мыши
function handleWheelScroll(event) {
  // Проверяем, является ли цель события (или его родитель) элементом с классом .scrolling
  const scrollingElement = event.currentTarget; // element, к которому прикреплен обработчик

  if (event.deltaX === 0) {
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
