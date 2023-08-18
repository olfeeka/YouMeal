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

const buy = document.getElementsByClassName("buy");
const y = document.querySelector(".you");
const phone = document.getElementById("phone");
const street = document.getElementById("a");
const floor = document.getElementById("aa");
const intercom = document.getElementById("aaa");

async function add() {
  const object = {
    userId: 1,
    title: y.value,
    phone: phone.value,
    street: street.value,
    floor: floor.value,
    intercom: intercom.value,
  };

  await fetch("http://localhost:3001/user", {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((user) => console.log(user));

  alert("Ваш заказ принят");
}

const emailInput = document.getElementById("phone");
const errorMessage = document.getElementById("err");
emailInput.oninput = function () {
  const phoneFormat =
    /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;

  if (emailInput.value.match(phoneFormat)) {
    errorMessage.textContent = "";
    return true;
  } else {
    errorMessage.textContent = "Ваш телефон введён неверно!";

    return false;
  }
};

//заголовки категории
const categoryArray = [
  "Бургеры",
  "Закуски",
  "Хот-доги",
  "Напитки",
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
        <button class="buttonMakeOrder" type="button" onclick="addToCart(${product.id})">Добавить</button>
      </div>`;
    });

    productList.innerHTML = productHTML;

    //меняем цвет кнопки после клика
    const buttonMakeOrder = document.querySelectorAll(".buttonMakeOrder");
    buttonMakeOrder.forEach((button) => {
      button.addEventListener("click", changeButtonColor);
    });

    function changeButtonColor(event) {
      const button = event.target;
      button.style.background = "#F86310";
      button.style.color = "#FFFF";
    }

    //подтягиваем хэдер
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
let cartItems = []; // массив для хранения товаров в корзине
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartButton = document.querySelector(".main__basket-btn");

//отрисовка корзины с сервера
async function fetchCart() {
  const response = await fetch("http://localhost:3001/cart");
  cartItems = await response.json();
  displayCart();
}
fetchCart();
// функция отрисовки карточки в корзине
function displayCart() {
  cartList.innerHTML = "";

  cartItems.forEach((product) => {
    const quantity = product.quantity;

    cartList.innerHTML += `
    <div class="cart-list__item">
    <img class="cart-list__img" src="${product.image_url}" alt="${product.name}"/>
    <div class="cart-list__info">
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

  if (cartItems.length > 0) {
    const totalPrice = cartItems.reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0
    );

    cartTotal.innerHTML = `
    <p>Итого</p>
    <p>${totalPrice}₽</p>`;

    cartButton.style.display = "block";
  } else {
    cartTotal.innerHTML = "";
    cartButton.style.display = "none";
  }

  updateCartQuantity();
}

// функция для добавления товара в корзину
async function addToCart(productId) {
  const existingProduct = cartItems.find((product) => product.id === productId); // проверяем, есть ли такой товар уже в корзине

  if (existingProduct) {
    return increaseQuantity(productId);
  }

  const product = filteredProducts.find((product) => product.id === productId); // находим товар с помощью id

  const cartItem = {
    ...product,
    quantity: 1,
  };

  try {
    await fetch("http://localhost:3001/cart", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(cartItem),
    });

    cartItems.push(cartItem); // если товара нет - добавляем его со значением количества 1

    // отрисовываем корзину
    displayCart();
  } catch (err) {
    console.error(err);
  }
}

// функция для увеличения количества товара в корзине
async function increaseQuantity(productId) {
  const cartItem = cartItems.find((product) => product.id === productId); // находим товар в корзине

  const newQuantity = cartItem.quantity + 1; // увеличиваем количество товара на 1

  try {
    await fetch(`http://localhost:3001/cart/${productId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    });

    cartItem.quantity = newQuantity; // обновляем количество товара в объекте cartItem

    displayCart(); // обновляем отображение корзины
  } catch (err) {
    console.error(err);
  }
}

//функция для уменьшения количества товара в корзине
async function decreaseQuantity(productId) {
  let cartItem = cartItems.find((product) => product.id === productId); // находим товар в корзине

  const newQuantity = cartItem.quantity - 1;
  if (newQuantity === 0) {
    return removeFromCart(productId);
  }
  try {
    await fetch(`http://localhost:3001/cart/${productId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    });

    cartItem.quantity = newQuantity;

    displayCart(); // обновляем отображение корзины
  } catch (error) {
    console.error(error);
  }
  //displayCart(); // обновляем отображение корзины
}
//удаление карточки товара
async function removeFromCart(productId) {
  try {
    await fetch(`http://localhost:3001/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    cartItems = cartItems.filter((cartItem) => cartItem.id !== productId);
  } catch (error) {
    console.error(error);
  }

  displayCart();
}

// функция для обновления количества товаров в корзине
function updateCartQuantity() {
  const basketQuantity = document.querySelector(".main__basket-quantity");
  const totalQuantity = cartItems.reduce(
    (total, product) => total + product.quantity,
    0
  );
  basketQuantity.textContent = totalQuantity;
}

/* "КОРЗИНА" end */

/* ПОПАП КАРТОЧКИ с подробной инфой start */
// отображение popup продукта при нажатии на картинку;

productList.addEventListener('click',(event)=>{
  if(event.target.classList.contains('product-list__img')){
      const {id} = event.target
      console.log(1, id)
      renederPopup(id)
  }
  })

  function renederPopup(id){
      const containerPopup = document.querySelector(".product-card_conteiner");
      console.log(2, containerPopup)
      containerPopup.classList.remove('none') ///открываем ее
      containerPopup.innerHTML = displayProductsCard(id)
  }


  async function displayProductsCard(id) {
    try {
      const response = await fetch("http://localhost:3001/products");
      const products = await response.json();

      // фильтруем продукты по id
      const filteredProductsCard = products.filter(
        (product) => product.id === id
      );
      //переменная для хранения кода
      let productCardHTML = "";
  
      // код для каждой popap card
      filteredProductsCard.forEach((product) => {
        productCardHTML += `
        <div class="product-card__conteiner">
        <h2 class="h2__meatbomb">${product.name}</h2>
        <span class="close">&times;</span>
      </div>
      <div class="product-card__conteiner1">
          <img
            class="product-card__img"
            src="${product.image_url}"
            alt="${product.name}"
          />
        <div class="product-card_div">
          <div class="product_card__description">
          ${product.description}
          </div>
          <div class="product-card__composition">Состав:</div>
          <div class="product-card__composition_ul">${product.composition}</div>
          <p class="product-card__kcal">${product.energy}</p>
        </div>
      </div>
      <div class="product-card__conteiner2">
        <button class="product-card__add">Добавить</button>
        <div class="product-card__conteiner3">
          <div class="product-card__btn-plus-minus">
            <span class="minus">-</span>
            <span class="number">1</span>
            <span class="plus">+</span>
          </div></div>
          <div class="product-card__price">${product.price}</div>
        </div>
      </div>`;
      });
  
     return productCardHTML;
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  }


// JS на кнопки - 1 +, тоже не работает ??

// // отображение popup продукта при нажатии на картинку

// productList.addEventListener("click", function (e) {
//   if (e.target.classList.contains("product-list__img")) {
//     displayProductsCard(1);
//   }
// });

// // JS на кнопки - 1 +, тоже не работает ??

// // const plus = document.querySelector(".plus");
// // const minus = document.querySelector(".minus");
// // const number = document.querySelector(".number");

// // let a = 1;
// // plus.addEventListener("click", () => {
// //   a++;
// //   number.innerHTML = a;
// // });
// // minus.addEventListener("click", () => {
// //   if (a > 1) {
// //     a--;
// //   }
// //   number.innerHTML = a;
// // });

