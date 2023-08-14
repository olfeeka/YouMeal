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

// получаем ссылку на элемент списка продуктов
const productList = document.querySelector(".product-list");

// отображение карточек продуктов

let filteredProducts;

async function displayProducts(categoryId) {
  try {
    // получаем данные с сервера
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();

    // фильтруем продукты по выбранной категории
    filteredProducts = products.filter(
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

// изменение выбранной радиокнопки
function handleRadioChange(event) {
  const categoryId = parseInt(event.target.value);
  displayProducts(categoryId);
}

// ссылки на все радиокнопки
const radioButtons = document.querySelectorAll(".menu__input");

// добавляем обработчик события изменения выбранной радиокнопки для каждой кнопки
radioButtons.forEach((button) => {
  button.addEventListener("change", handleRadioChange);
});

// при загрузке страницы отображаем продукты из первой категории
displayProducts(1);



/* "КОРЗИНА" start */

let cartItems = []; // массив для хранения добавленных товаров

// функция для обновления счетчика товаров в корзине
// function updateCartCounter() {
//   const cartCounter = document.querySelector(".main__basket-quantity");
//   cartCounter.innerText = cartItems.length;
// }


// функция отрисовки карточки в корзине
// получаем ссылку на элемент списка продуктов в корзине
const cartList = document.querySelector(".cart-list");

function displayCart() {
  cartList.innerHTML = "";

  cartItems.forEach((product) => {
    const quantity = product.quantity;

    cartList.innerHTML += `
    <div class="cart-list__item">
    <img class="cart-list__img" src="${product.image_url}" alt="${product.name}"/>
    <div class="cart-list__info"
    <p class="cart-list__name">${product.name}</p>
    <p class="cart-list__weight">${product.energy}</p>
    <p class="cart-list__price">${product.price}</p>
    </div>
    <div class="cart-list__counter">
    <button class="cart-list__btn-minus" onclick="decreaseQuantity(${product.id})">-</button>
    <span class="cart-list__quantity">${quantity}</span>
    <button class="cart-list__btn-plus" onclick="increaseQuantity(${product.id})">+</button>
    </div>
    </div>`;
  });
}


// функция для добавления товара в корзину
function addToCart(productId) {
  // находим товар с помощью id
  const product = filteredProducts.find((product) => product.id === productId);

   // проверяем, есть ли такой товар уже в корзине
  const existingProduct = cartItems.find((product) => product.id === productId);
  if (existingProduct) {
    // если товар уже есть в корзине, увеличиваем его количество на 1
    existingProduct.quantity += 1;
  } else {
    // если товара нет в корзине, добавляем его со значением количества 1
    cartItems.push({ ...product, quantity: 1 });
  }

  // обновляем счетчик товаров в корзине
  //updateCartCounter();

   // отрисовываем корзину
   displayCart();
}


// функция для увеличения количества товара в корзине
function increaseQuantity(productId) {
  // находим товар в корзине
  const product = cartItems.find((product) => product.id === productId);
  // увеличиваем количество товара на 1
  product.quantity += 1;

  // обновляем отображение корзины
  displayCart();
}


// функция для уменьшения количества товара в корзине
function decreaseQuantity(productId) {
  // находим товар в корзине
  const product = cartItems.find((product) => product.id === productId);
  // проверяем, если количество товара равно 1, то удаляем его из корзины
  if (product.quantity === 1) {
    cartItems = cartItems.filter((item) => item.id !== productId);
  } else {
    // иначе уменьшаем количество товара на 1
    product.quantity -= 1;
  }
  // обновляем счетчик товаров в корзине
  //updateCartCounter();
  
  // обновляем отображение корзины
  displayCart();
}
/* "КОРЗИНА" end */