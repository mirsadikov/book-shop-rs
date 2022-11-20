const headerContent = `
<a href="/"><h1> Book Shop </h1></a>
<div class="hero">
<p>Order</p>
</div>`;

const formContent = `
<input class="form__input" type="text" name="name" placeholder="Name">
<input class="form__input" type="text" name="surname" placeholder="Surname">
<input class="form__input" type="date" name="date" min="2021-01-01">
<input class="form__input" type="text" name="street" placeholder="Street">
<input class="form__input" type="number" name="houseNumber" placeholder="House number">
<input class="form__input" type="text" name="flatNumber" placeholder="Flat number">
<input class="form__input" type="radio" name="paymenttype" value="cash" id="paymentCash" checked="checked">
<label class="form__label" for="paymentCash">Cash</label>
<input class="form__input" type="radio" name="paymenttype" value="card" id="paymentCard">
<label class="form__label" for="paymentCard">Card</label>
<button class="form__button" type="submit">Order</button>`;

const body = document.querySelector('body');
const headerEl = createElement('header', 'header', headerContent);
const footer = createElement('footer', 'footer');
const main = createElement('main', 'main');
const formEl = createElement('form', 'form', formContent);
let books = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // HEADER
  body.appendChild(headerEl);

  // MAIN
  body.appendChild(main);
  const mainContainer = createElement('div', 'container');
  main.insertAdjacentElement('beforeend', mainContainer);

  // FORM
  mainContainer.appendChild(formEl);

  // FOOTER
  body.appendChild(footer);
});

fetch('../books.json')
  .then((response) => response.json())
  .then((data) => {
    books = data;
  });

function createElement(tag, className, content, attr) {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = content || '';
  if (attr) {
    attr.forEach((item) => {
      element.setAttribute(item.name, item.value);
    });
  }
  return element;
}
