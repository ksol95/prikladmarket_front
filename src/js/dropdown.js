
const handleDropdownClose = (e) => {
  const openingDropdown = document.querySelector('.dropdown.open');
  if (!openingDropdown.contains(e.target)) {
    closeDropdown(openingDropdown);
  }
};
const openDropdown = (dropdown) => {
  const distance = dropdown.getBoundingClientRect();
  const distanceToBottom = window.innerHeight - distance.bottom;
  const list = dropdown.querySelector('.dropdown__list');
  const listHeight = list.offsetHeight;

  if (listHeight > distanceToBottom) {
    dropdown.classList.add('open-top');
    list.style.top = 'auto';
    list.style.bottom = '100%';
  } else {
    dropdown.classList.add('open-bottom');
    list.style.bottom = 'auto';
    list.style.top = '100%';
  }

  dropdown.classList.remove('closed');
  dropdown.classList.add('open');

  document.addEventListener('mousedown', handleDropdownClose);
};

const closeDropdown = (dropdown) => {
  if (dropdown.classList.contains('open')) {
    dropdown.classList.remove('open');
    dropdown.classList.add('closed');

    dropdown.classList.contains('open-top') &&
      dropdown.classList.remove('open-top');

    dropdown.classList.contains('open-bottom') &&
      dropdown.classList.remove('open-bottom');
  }

  document.removeEventListener('mousedown', handleDropdownClose);
};

const handleDropDown = (dropdown) => {
  if (dropdown.classList.contains('open')) {
    closeDropdown(dropdown);
  } else {
    openDropdown(dropdown);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach((dropdown) => {
    const attrGroupId = dropdown.getAttribute('data-attr-group');
    const dropdownTitle = dropdown.querySelector('.dropdown__title');
    dropdownTitle.addEventListener('click', () => {
      handleDropDown(dropdown);
    });
    const dropdownInputs = dropdown.querySelectorAll('.dropdown__list-item');
    dropdownInputs.forEach((item) => {
      const input = item.querySelector('.attr-button__control');
      input.onclick = (e) => {
        const tipId = item.querySelector('input').value;
        const newTip = document.createElement('span');
        const tipsTitle = dropdownTitle.querySelector('.tips-title');

        newTip.classList.add('tip');
        newTip.setAttribute('data-attr', tipId);
        newTip.innerHTML = item.querySelector('.attr-button__name').textContent;

        if (!dropdownTitle.querySelector(`.tip[data-attr="${tipId}"]`)) {
          dropdownTitle.append(newTip);
        } else {
          dropdownTitle.querySelector(`.tip[data-attr="${tipId}"]`).remove();
        }
        const tipsCount = dropdownTitle.querySelectorAll(`.tip`).length;

        tipsCount > 0
          ? (tipsTitle.textContent = `Выбранно (${tipsCount})`)
          : (tipsTitle.textContent = `Выберите`);
      };
    });
  });

  const productDescription = document.querySelector('.description');

  if (productDescription.clientHeight > 400) {
    productDescription.classList.add('short-block');
    const button = document.createElement('button');
    button.textContent = 'Показать полностью';
    button.classList.add('button');
    button.classList.add('short-block__button');

    button.addEventListener('click', function () {
      productDescription.style.height = 'auto';
      productDescription.classList.remove('short-block');
      button.remove();
    });
    productDescription.appendChild(button);
  }
});