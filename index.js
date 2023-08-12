// кусок поп ап
let popupBg = document.querySelector(".popup__bg");
let popup = document.querySelector(".popup");
let openPopupButtons = document.querySelectorAll(".open-popup");
let closePopupButton = document.querySelector(".close-popup");

openPopupButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    popupBg.classList.add("active");
    popup.classList.add("active");
  });
});

closePopupButton.addEventListener("click", () => {
  popupBg.classList.remove("active");
  popup.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target === popupBg) {
    popupBg.classList.remove("active");
    popup.classList.remove("active");
  }
});

const d = document.getElementById("delivery__b");
const p = document.getElementById("pickup__b");

d.onchange = function () {
  document.querySelector(".none").setAttribute("style", "display: block;");
};
p.onchange = function () {
  document.querySelector(".none").setAttribute("style", "display: none;");
};

//заголовки категории
const categoryArray = [
  "Бургеры",
  "Закуски",
  "Хот-доги",
  "Комбо",
  "Шаурма",
  "Пицца",
  "Вок",
  "Десерты",
  "Соусы",
];

// Получаем ссылку на элемент списка продуктов
const productList = document.querySelector(".product-list");

// Обработчик события нажатия на кнопку "добавить в корзину"
function addToCart(productId) {
  // Ваш код для добавления продукта в корзину
  console.log(`Добавлен продукт с id ${productId} в корзину`);
}

// Функция для отображения карточек продуктов
async function displayProducts(categoryId) {
  try {
    // Получаем данные с сервера
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();

    // Фильтруем продукты по выбранной категории
    const filteredProducts = products.filter(
      (product) => product.category_id === categoryId
    );
    //переменная для хранения кода
    let productHTML = "";

    // код для каждой карточки
    filteredProducts.forEach((product) => {
      productHTML += `
      <div class="product-list__item">
        <img class="product-list__img" src="${product.image_url}" alt="${product.name}"/>
        <h3 class="product-list__price">${product.price}</h3>
        <p class="product-list__name">${product.name}</p>
        <p class="product-list__weight">${product.energy}</p>
        <button type="button" onclick="addToCart(${product.id})">Добавить</button>
      </div>`;
    });

    productList.innerHTML = productHTML;

    let header = document.querySelector(".product-list__header");
    header.innerHTML = categoryArray[categoryId - 1];
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

// Обработчик события изменения выбранной радиокнопки
function handleRadioChange(event) {
  const categoryId = parseInt(event.target.value);
  displayProducts(categoryId);
}

// Получаем ссылки на все радиокнопки
const radioButtons = document.querySelectorAll(".menu__input");

// Добавляем обработчик события изменения выбранной радиокнопки для каждой кнопки
radioButtons.forEach((button) => {
  button.addEventListener("change", handleRadioChange);
});

// При загрузке страницы отображаем продукты из первой категории
displayProducts(1);
