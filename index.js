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

async function add(e) {
  e.preventDefault();
  console.log(e);
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

  await deleteCart();
  alert("Ваш заказ принят");
}

async function deleteCart() {
  const cardsBasketArr = await getCardsBasket();
  for (const item of cardsBasketArr) {
    await fetch(`http://localhost:3001/cart/${item.id}`, {
      method: "DELETE",
    });
  }

  upDateCart([]);
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
        <img class="product-list__img" id="${product.id}" src="${product.image_url}" alt="${product.name}"/>
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
const basketQuantity = document.getElementById("basket-quantity");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartButton = document.querySelector(".main__basket-btn");

document.addEventListener("DOMContentLoaded", () => {
  getCardsBasket().then((cardsBasketArr) => {
    upDateCart(cardsBasketArr);
  });
});

// функция для возврата всех карточек что лежат в корзине
async function getCardsBasket() {
  const response = await fetch("http://localhost:3001/cart");
  return await response.json();
}

// функция для добавления товара в корзину
async function addToCart(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex((product) => product.id === productId); // проверяем, есть ли такой товар в корзине

  if (existingProductIndex !== -1) {
    increaseQuantity(productId); // вызов функции увеличения товара в корзине
  } else {
    const product = await getProduct(productId); // получаем информацию о товаре по его id
    product.quantity = 1; // устанавливаем количество товара в 1
    cardsBasketArr.push(product); // добавляем товар в массив корзины

    await fetch("http://localhost:3001/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  }
  upDateCart(cardsBasketArr);
}

// функция для получения информац о товаре по id
async function getProduct(productId) {
  const response = await fetch(`http://localhost:3001/products/${productId}`);
  return await response.json();
}

// функция отображения корзины
function upDateCart(cardsBasketArr) {
  let cartHTML = "";

  cardsBasketArr.forEach((product) => {
    const quantity = product.quantity;

    cartHTML += `
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
  cartList.innerHTML = cartHTML;

  const totalQuantity = cardsBasketArr.reduce(
    (total, product) => total + product.quantity, 0); // подсчет общего кол-ва товаров
  basketQuantity.textContent = totalQuantity;

  if (cardsBasketArr.length > 0) { // если корзина не пуста - подсчет общей суммы
    const totalPrice = cardsBasketArr.reduce((total, product) => total + parseFloat(product.price) * product.quantity, 0);

    cartTotal.innerHTML = `
    <p>Итого</p>
    <p>${totalPrice}₽</p>`;
    cartButton.style.display = "block";
  } else {
    cartTotal.innerHTML = "";
    cartButton.style.display = "none";
  }
}

// функция для увеличения количества товара в корзине
async function increaseQuantity(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex((product) => product.id === productId);

  if (existingProductIndex !== -1) {
    cardsBasketArr[existingProductIndex].quantity += 1;

    await fetch(`http://localhost:3001/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardsBasketArr[existingProductIndex]),
    });
    upDateCart(cardsBasketArr);
  }
}

// функция для уменьшения количества товара в корзине
async function decreaseQuantity(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex((product) => product.id === productId);

  if (existingProductIndex !== -1) {
    if (cardsBasketArr[existingProductIndex].quantity > 1) {
      cardsBasketArr[existingProductIndex].quantity -= 1;

      await fetch(`http://localhost:3001/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardsBasketArr[existingProductIndex]),
      });
    } else {
      cardsBasketArr.splice(existingProductIndex, 1);
      await fetch(`http://localhost:3001/cart/${productId}`, {
        method: "DELETE",
      });
    }
    upDateCart(cardsBasketArr);
  }
}


/* ПОПАП КАРТОЧКИ с подробной инфой start */
const containerPopup = document.querySelector(".product-card_conteiner");

// отображение popup продукта при нажатии на картинку;
productList.addEventListener('click', async (event)=>{
  let id=event.target.id;
  if(event.target.classList.contains('product-list__img')){
      await displayProductsCard(id);

let popupBg = document.querySelector(".product-card__bg");
let popup = document.querySelector(".product-card__conteiner");
let closePopupButton = document.querySelector(".close");

      event.preventDefault();
      popupBg.classList.add("active");
      popup.classList.add("active");

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
  }
  });

  async function displayProductsCard(id) {
    try {
      const response = await fetch("http://localhost:3001/products");
      const products = await response.json();
      
      const filteredProductsCard = products.filter((product) => product.id === parseInt(id)); // фильтруем продукты по id
      let productCardHTML = ""; //переменная для хранения кода
  
      // код для каждой popap card
      filteredProductsCard.forEach((product) => {
        productCardHTML += `
        <div class="product-card__bg">
          <div class="product-card__conteiner">
            <div class="h2__meatbomb">${product.name}</div>
            <span class="close">&times;</span>
            <div class="product-card__conteiner1">
              <img class="product-card__img" src="${product.image_url}" alt="${product.name}"/>
              <div class="product-card_div">
                <div class="product_card__description">${product.description}</div>
                <div class="product-card__composition">Состав:</div>
                <div class="product-card__composition_ul">${product.composition}</div>
                <p class="product-card__kcal">${product.energy}</p>
                <div class="product-card__price">${product.price}</div>
              </div>
            </div>
          </div>
        </div>`;
      });

    containerPopup.innerHTML = productCardHTML;
    containerPopup.style.display = "block";
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  }


  // /* "КОРЗИНА" start */
// let cartItems = []; // массив для хранения товаров в корзине
// const cartList = document.querySelector(".cart-list");
// const cartTotal = document.querySelector(".cart-total");
// const cartButton = document.querySelector(".main__basket-btn");

// //отрисовка корзины с сервера
// async function fetchCart() {
//   const response = await fetch("http://localhost:3001/cart");
//   cartItems = await response.json();
//   displayCart();
// }
// fetchCart();
// // функция отрисовки карточки в корзине
// function displayCart() {
//   cartList.innerHTML = "";

//   cartItems.forEach((product) => {
//     const quantity = product.quantity;

//     cartList.innerHTML += `
//     <div class="cart-list__item">
//     <img class="cart-list__img" src="${product.image_url}" alt="${product.name}"/>
//     <div class="cart-list__info">
//     <p class="cart-list__name">${product.name}</p>
//     <p class="cart-list__weight">${product.energy}</p>
//     <p class="cart-list__price">${product.price}</p>
//     </div>
//     <div class="cart-list__counter">
//     <button class="cart-list__btn-minus" onclick="decreaseQuantity(${product.id})">-</button>
//     <span class="cart-list__quantity">${quantity}</span>
//     <button class="cart-list__btn-plus" onclick="increaseQuantity(${product.id})">+</button>
//     </div>
//     </div>`;
//   });

//   if (cartItems.length > 0) {
//     const totalPrice = cartItems.reduce(
//       (total, product) => total + parseFloat(product.price) * product.quantity,
//       0
//     );

//     cartTotal.innerHTML = `
//     <p>Итого</p>
//     <p>${totalPrice}₽</p>`;

//     cartButton.style.display = "block";
//   } else {
//     cartTotal.innerHTML = "";
//     cartButton.style.display = "none";
//   }

//   updateCartQuantity();
// }

// // функция для добавления товара в корзину
// async function addToCart(productId) {
//   const existingProduct = cartItems.find((product) => product.id === productId); // проверяем, есть ли такой товар уже в корзине

//   if (existingProduct) {
//     return increaseQuantity(productId);
//   }

//   const product = filteredProducts.find((product) => product.id === productId); // находим товар с помощью id

//   const cartItem = {
//     ...product,
//     quantity: 1,
//   };

//   try {
//     await fetch("http://localhost:3001/cart", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(cartItem),
//     });

//     cartItems.push(cartItem); // если товара нет - добавляем его со значением количества 1

//     // отрисовываем корзину
//     displayCart();
//   } catch (err) {
//     console.error(err);
//   }
// }

// // функция для увеличения количества товара в корзине
// async function increaseQuantity(productId) {
//   const cartItem = cartItems.find((product) => product.id === productId); // находим товар в корзине

//   const newQuantity = cartItem.quantity + 1; // увеличиваем количество товара на 1

//   try {
//     await fetch(`http://localhost:3001/cart/${productId}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "PATCH",
//       body: JSON.stringify({
//         quantity: newQuantity,
//       }),
//     });

//     cartItem.quantity = newQuantity; // обновляем количество товара в объекте cartItem

//     displayCart(); // обновляем отображение корзины
//   } catch (err) {
//     console.error(err);
//   }
// }

// //функция для уменьшения количества товара в корзине
// async function decreaseQuantity(productId) {
//   let cartItem = cartItems.find((product) => product.id === productId); // находим товар в корзине

//   const newQuantity = cartItem.quantity - 1;
//   if (newQuantity === 0) {
//     return removeFromCart(productId);
//   }
//   try {
//     await fetch(`http://localhost:3001/cart/${productId}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "PATCH",
//       body: JSON.stringify({
//         quantity: newQuantity,
//       }),
//     });

//     cartItem.quantity = newQuantity;

//     displayCart(); // обновляем отображение корзины
//   } catch (error) {
//     console.error(error);
//   }
//   //displayCart(); // обновляем отображение корзины
// }
// //удаление карточки товара
// async function removeFromCart(productId) {
//   try {
//     await fetch(`http://localhost:3001/cart/${productId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     cartItems = cartItems.filter((cartItem) => cartItem.id !== productId);
//   } catch (error) {
//     console.error(error);
//   }

//   displayCart();
// }

// // функция для обновления количества товаров в корзине
// function updateCartQuantity() {
//   const basketQuantity = document.querySelector(".main__basket-quantity");
//   const totalQuantity = cartItems.reduce(
//     (total, product) => total + product.quantity,
//     0
//   );
//   basketQuantity.textContent = totalQuantity;
// }

// /* "КОРЗИНА" end */