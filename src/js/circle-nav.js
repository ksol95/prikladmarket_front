const headerNav = document.querySelector(".circle");
const headerNavItems = headerNav.querySelectorAll(".header__nav-item");
const itemsCount = 10;//headerNavItems.length; // Количество элементов
// const radius = 100; // Радиус окружности

// for (let i = 0; i < itemsCount; i++) {
// 	const itemWidth = headerNavItems[i].offsetWidth;
// 	const itemHeight = headerNavItems[i].offsetHeight;

//   const angle = (i / itemsCount) * 2 * Math.PI; // Угол в радианах
// 	// console.log(angle);
// 	console.log(Math.cos(angle));
//   const x = Math.cos(angle) * radius; // Координата X
// 	console.log(x);
//   const y = (Math.sin(angle) * radius); // Координата Y

//   const item = headerNavItems[i];
//   item.style.left = `${radius + x}px`; // Смещение относительно центра
//   item.style.top = `${radius + y}px`;
// }

// const container = document.getElementById('arcContainer');
// const itemsCount = 10; // Количество элементов
const radius = 100; // Радиус дуги
const startAngle = 0; // Начальный угол (в градусах)
const endAngle = 180; // Конечный угол (в градусах)

for (let i = 0; i < itemsCount; i++) {
  const angle = ((endAngle - startAngle) / (itemsCount - 1)) * i + startAngle; // Текущий угол
  const radian = (angle * Math.PI) / 180; // Переводим угол в радианы

  // Вычисляем координаты
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  // Создаем элемент
  headerNavItems[i].style.left = `${20 + x - 20}px`; // Центр контейнера + координата X
  headerNavItems[i].style.top = `${20 - y - 20}px`; // Центр контейнера - координата Y

}