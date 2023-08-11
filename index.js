async function getData() {
  //получаем данные с сервера
}

const btns = document.querySelectorAll(".menu__input");

btns.forEach((btn) => {
  btn.addEventListener("click", renderMenu);
});

function renderMenu(event) {}

function renderMenuItem(product) {
  //карточка с продуктом
}
