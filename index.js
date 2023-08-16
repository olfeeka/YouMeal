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

const buy = document.getElementsByClassName('buy')
const y = document.querySelector('.you')
const phone = document.getElementById('phone')
const street = document.getElementById('a')
const floor = document.getElementById('aa')
const intercom = document.getElementById('aaa')

async function add()
{
const object = {
  userId: 1,
  title: y.value,
  phone: phone.value,
  street: street.value,
  floor: floor.value,
  intercom: intercom.value,}

await fetch('http://localhost:3001/user', {
    method: 'POST',
    body: JSON.stringify(object),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(user => console.log(user))

  alert('Ваш заказ принят')
}



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



/* "КОРЗИНА" start */ // Екатерина
let cartItems = []; // массив для хранения товаров в корзине
//const cartContainer = document.querySelector(".main__basket");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartButton = document.querySelector(".main__basket-btn");


// функция отрисовки карточки в корзине
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

  if (cartItems.length > 0) {
    const totalPrice = cartItems.reduce((total, product) => total + (parseFloat(product.price) * product.quantity), 0);

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
function addToCart(productId) {
  const product = filteredProducts.find((product) => product.id === productId); // находим товар с помощью id

  const existingProduct = cartItems.find((product) => product.id === productId); // проверяем, есть ли такой товар уже в корзине
  if (existingProduct) {
    existingProduct.quantity += 1; // если товар уже есть - увеличиваем его количество на 1
  } else {
    cartItems.push({ ...product, quantity: 1 }); // если товара нет - добавляем его со значением количества 1
  }

  // отрисовываем корзину
  displayCart();
}


// функция для увеличения количества товара в корзине
function increaseQuantity(productId) {
  const product = cartItems.find((product) => product.id === productId); // находим товар в корзине

  product.quantity += 1; // увеличиваем количество товара на 1

  displayCart(); // обновляем отображение корзины
}


// функция для уменьшения количества товара в корзине
function decreaseQuantity(productId) {
  const product = cartItems.find((product) => product.id === productId); // находим товар в корзине

  if (product.quantity === 1) {
    cartItems = cartItems.filter((item) => item.id !== productId); // проверяем, если кол-во равно 1, то удаляем его из корзины
  } else {
    product.quantity -= 1; // иначе уменьшаем количество товара на 1
  }

  displayCart(); // обновляем отображение корзины
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



/* ПОПАП КАРТОЧКИ с подробной инфой start */ // Марина
// отображение popup продукта при нажатии на картинку
const productCard_conteiner  = document.querySelector(".product-card_conteiner");

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


    productCard_conteiner.innerHTML = productCardHTML;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

// отображение popup продукта при нажатии на картинку

productList.addEventListener('click', function (e) {
  if (e.target.classList.contains('product-list__img'))
  {
    displayProductsCard(1)
  }
} )


// JS на кнопки - 1 +, тоже не работает ??

const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const number = document.querySelector(".number");

let a = 1;
plus.addEventListener("click", ()=>{
    a++;
    number.innerHTML=a;}
    )
minus.addEventListener("click", ()=>{
    if(a > 1){
        a--}
        number.innerHTML=a;}
        )

/* ПОПАП КАРТОЧКИ с подробной инфой end */