// let isScrollLocked = false;

// // Функция для блокировки скролла страницы
// const lockScroll = () => {
//   isScrollLocked = true;
//   document.addEventListener("wheel", preventScroll, { passive: false }); // Для колесика мыши
//   document.addEventListener("touchmove", preventScroll, { passive: false }); // Для сенсорных устройств
// };

// // Функция для разблокировки скролла страницы
// const unlockScroll = () => {
//   isScrollLocked = false;
//   document.removeEventListener("wheel", preventScroll, { passive: false });
//   document.removeEventListener("touchmove", preventScroll, { passive: false });
// };

// // Функция для предотвращения прокрутки страницы
// const preventScroll = (event) => {
//   if (isScrollLocked && !event.target.closest(".header__nav-menu")) {
//     event.preventDefault();
//   }
// };

// // Функция для обработки прокрутки внутри menuList
// const handleScroll = (event, list) => {
//   const { scrollTop, scrollHeight, clientHeight } = list;
//   const scrollBottom = scrollTop + clientHeight;
//   const scrollBottomBreak = scrollHeight - clientHeight;
//   // console.log(
//   //   scrollTop,
//   //   scrollBottom,
//   //   scrollHeight,
//   //   clientHeight,
//   //   scrollBottomBreak
//   // );

//   let isAtTop = false;
//   let isAtBottom = false;

//   // Проверяем, находится ли пользователь в начале или в конце списка
//   if (event.touches) {
//     // Для touchmove (мобильные устройства)
//     isAtTop =
//       scrollTop === 0 &&
//       event.touches[0].clientY > event.changedTouches[0].clientY; // Прокрутка вверх за пределы начала

//     isAtBottom =
//       scrollBottom >= scrollHeight &&
//       event.touches[0].clientY < event.changedTouches[0].clientY; // Прокрутка вниз за пределы конца
//   } else {
//     // Для wheel (мышка)
//     isAtTop = scrollTop === 0 && event.deltaY < 0; // Прокрутка вверх за пределы начала
//     isAtBottom = scrollBottom >= scrollHeight && event.deltaY > 0; // Прокрутка вниз за пределы конца
//   }
//   if (scrollTop <= 0) list.scrollTop = 0;
//   if (scrollTop >= scrollBottomBreak) {
//     list.scrollTop -= 10;
//     console.log("Минуснул", list.scrollTop);
//     // console.log(document.body.scrollTop);
//   }

//   // Если пользователь пытается прокрутить за пределы списка
//   if (isAtTop || isAtBottom) {
//     event.preventDefault(); // Отменяем событие
//   } else {
//     event.stopPropagation(); // Предотвращаем всплытие события
//   }
// };

// // Находим элементы
// const header = document.querySelector(".header");
// const menuButton = header.querySelector(".header__menu-button input");
// const menuList = header.querySelector(".header__nav-menu");

// // Обработчик touchmove для menuList
// menuList.addEventListener(
//   "touchmove",
//   (event) => {
//     event.stopPropagation(); // Предотвращаем всплытие события
//     handleScroll(event, menuList);
//   },
//   { passive: false }
// );

// // Обработчик wheel для menuList
// menuList.addEventListener(
//   "wheel",
//   (event) => {
//     event.stopPropagation(); // Предотвращаем всплытие события
//     handleScroll(event, menuList);
//   },
//   { passive: false }
// );

// // Обработчик изменения состояния чекбокса
// menuButton.addEventListener("change", () => {
//   if (menuButton.checked) {
//     lockScroll(); // Блокируем скролл
//   } else {
//     unlockScroll(); // Разблокируем скролл
//   }
// });

const header = document.querySelector(".header");
const menuButton = header.querySelector(".header__menu-button input");

menuButton.addEventListener("change", () => {
  if (menuButton.checked) {
    document.body.classList.add("scrollBlock"); // Блокируем скролл
  } else {
    document.body.classList.remove("scrollBlock"); // Разблокируем скролл
  }
});
