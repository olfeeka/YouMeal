/* КАРТОЧКИ ТОВАРОВ */
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
const productList = document.querySelector(".product-list");
const radioButtons = document.querySelectorAll(".menu__input");

// отображение карточек товаров
let filteredProducts = "";

async function displayProducts(categoryId) {
  try {
    const response = await fetch("http://localhost:3001/products");
    const products = await response.json();

    filteredProducts = products.filter(
      (product) => product.category_id === categoryId
    );

    let productHTML = "";

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

    const buttonMakeOrder = document.querySelectorAll(".buttonMakeOrder");
    buttonMakeOrder.forEach((button) => {
      button.addEventListener("click", changeButtonColor);
    });

    function changeButtonColor(event) {
      const button = event.target;
      button.style.background = "#F86310";
      button.style.color = "#FFFF";
    }

    let header = document.querySelector(".product-list__header");
    header.innerHTML = categoryArray[categoryId - 1];
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

function handleRadioChange(event) {
  const categoryId = parseInt(event.target.value);
  displayProducts(categoryId);
}

radioButtons.forEach((button) => {
  button.addEventListener("change", handleRadioChange);
});

displayProducts(1);


/* ПОП-АП ДЛЯ КАРТОЧКИ ТОВАРА */
const containerPopup = document.querySelector(".product-card_conteiner");

productList.addEventListener("click", async (event) => {
  let id = event.target.id;
  if (event.target.classList.contains("product-list__img")) {
    await displayProductsCard(id);

    const popupBg = document.querySelector(".product-card__bg");
    const popup = document.querySelector(".product-card__conteiner");
    const closePopupButton = document.querySelector(".close");

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

    const filteredProductsCard = products.filter(
      (product) => product.id === parseInt(id)
    );
    let productCardHTML = "";

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


/* КОРЗИНА */
const basketQuantity = document.getElementById("basket-quantity");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartButton = document.querySelector(".main__basket-btn");

document.addEventListener("DOMContentLoaded", () => {
  getCardsBasket().then((cardsBasketArr) => {
    upDateCart(cardsBasketArr);
  });
});

// возврат всех карточек что лежат в корзине
async function getCardsBasket() {
  const response = await fetch("http://localhost:3001/cart");
  return await response.json();
}

// добавление товара в корзину
async function addToCart(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex(
    (product) => product.id === productId
  );

  if (existingProductIndex !== -1) {
    increaseQuantity(productId);
  } else {
    const product = await getProduct(productId);
    product.quantity = 1;
    cardsBasketArr.push(product);

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

// получение информац о товаре по id
async function getProduct(productId) {
  const response = await fetch(`http://localhost:3001/products/${productId}`);
  return await response.json();
}

// отображение корзины
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
    (total, product) => total + product.quantity,
    0
  );
  basketQuantity.textContent = totalQuantity;

  if (cardsBasketArr.length > 0) {
    const totalPrice = cardsBasketArr.reduce(
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
}

// увеличение количества товара в корзине
async function increaseQuantity(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex(
    (product) => product.id === productId
  );

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

// уменьшение количества товара в корзине
async function decreaseQuantity(productId) {
  const cardsBasketArr = await getCardsBasket();
  const existingProductIndex = cardsBasketArr.findIndex(
    (product) => product.id === productId
  );

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


/* ПОП-АП ДЛЯ ОФОРМЛЕНИЯ ЗАКАЗА */
const popupBg = document.querySelector(".popup__bg");
const popup = document.querySelector(".popup");
const openPopupButtons = document.querySelectorAll(".open-popup");
const closePopupButton = document.querySelector(".close-popup");

document.addEventListener("click", (e) =>{
  if(e.target.classList.contains("open-popup")) {
    e.preventDefault();
    popupBg.classList.add("active");
    popup.classList.add("active");
  } else if(e.target === popupBg || e.target === closePopupButton) {
    popupBg.classList.remove("active");
    popup.classList.remove("active");
  }
});

const choiceDelivery = document.getElementById("choice-delivery");
const choicePickup = document.getElementById("choice-pickup");

choiceDelivery.onchange = function () {
  document.querySelector(".none").setAttribute("style", "display: block;");
};
choicePickup.onchange = function () {
  document.querySelector(".none").setAttribute("style", "display: none;");
};

const buy = document.getElementsByClassName("buy");
const yourName = document.querySelector(".you");
const phone = document.getElementById("phone");
const street = document.getElementById("address-street");
const floor = document.getElementById("address-floor");
const intercom = document.getElementById("address-intercom");

async function sendUserData(e) {
  try {
    e.preventDefault();
    const object = {
      title: yourName.value,
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
    });
  } catch (e) {
    console.error(e);
  }
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
