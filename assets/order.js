const headerContent = `
<a href="/"><h1> Book Shop </h1></a>
<div class="hero">
<p>Order</p>
</div>`;

const formContent = `
<p class="form__error"></p>
<input class="form__input" type="text" name="name" placeholder="Name" required>
<p class="form__error"></p>
<input class="form__input" type="text" name="surname" placeholder="Surname" required>
<p class="form__error"></p>
<input class="form__input" type="text" name="street" placeholder="Street" required>
<p class="form__error"></p>
<input class="form__input" type="number" name="houseNumber" placeholder="House number" required>
<p class="form__error"></p>
<input class="form__input" type="text" name="flatNumber" placeholder="Flat number" required>
<p class="form__error"></p>
<input class="form__input" type="date" name="date" required">
<div class="form__payments">
<div class="payment">
<input type="radio" name="paymenttype" value="cash" id="paymentCash" checked="checked" required>
<label class="form__label" for="paymentCash">Cash</label>
</div>
<div class="payment">
<input type="radio" name="paymenttype" value="card" id="paymentCard" required>
<label class="form__label" for="paymentCard">Card</label>
</div>
</div>
<div class="gifts">
<div class="gift">
<input type="checkbox" name="gift" value="gift1" id="gift1">
<label class="form__label" for="gift1">Pack as gift</label>
</div>
<div class="gift">
<input type="checkbox" name="gift" value="gift2" id="gift2">
<label class="form__label" for="gift2">Add postcard</label>
</div>
<div class="gift">
<input type="checkbox" name="gift" value="gift3" id="gift3">
<label class="form__label" for="gift3">2% discount to the next time</label>
</div>
<div class="gift">
<input type="checkbox" name="gift" value="gift4" id="gift4">
<label class="form__label" for="gift4">Branded pen or pencil</label>
</div>
</div>
<input class="form__button" type="submit" disabled value="Order">`;

const body = document.querySelector('body');
const headerEl = createElement('header', 'header', headerContent);
const footer = createElement('footer', 'footer');
const main = createElement('main', 'main');
const formEl = createElement('form', 'form', formContent);
let books = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  // HEADER
  body.appendChild(headerEl);

  // MAIN
  body.appendChild(main);
  const mainContainer = createElement('div', 'container');
  main.insertAdjacentElement('beforeend', mainContainer);

  // FORM
  mainContainer.appendChild(formEl);
  document.querySelector('.form__input[type="date"]').min = getTomorrow()
    .toISOString()
    .split('T')[0];

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const order = {
      name: formData.get('name'),
      surname: formData.get('surname'),
      street: formData.get('street'),
      houseNumber: formData.get('houseNumber'),
      flatNumber: formData.get('flatNumber'),
      date: formData.get('date'),
      paymentType: formData.get('paymenttype'),
      books: cart,
    };
    const modal = createElement('div', 'modal');

    const modalContent = createElement('div', 'modal__content');
    modalContent.innerHTML = `
    <h2>Order is created!</h2>
    <p>Address: ${order.street}, ${order.houseNumber}, ${order.flatNumber}</p>
    <p>Order number: ${Math.floor(Math.random() * 1000000)}</p>
    <p>Delivery date: ${new Date(order.date).toLocaleString()}</p>
    <p>Payment type: ${order.paymentType}</p>
    <p>Books:</p>
    <ul>
    ${order.books
      .map((book) => {
        return `<li>${book.title} - ${book.price} $</li>`;
      })
      .join('')}
    </ul>
    <p>Total price: ${order.books.reduce((acc, book) => {
      return acc + book.price;
    }, 0)} $</p>
    <button class="modal__button">Close</button>
    `;
    modal.appendChild(modalContent);
    body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__button')) {
        modal.remove();
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        form.reset();
        window.location.reload();
      }
    });
  });

  document.querySelectorAll('.form__input').forEach((input) => {
    input.addEventListener('blur', () => {
      if (!checkValidity(input).valid) {
        input.classList.add('form__input--invalid');
        input.previousElementSibling.innerHTML = checkValidity(input).message;
      }
    });

    input.addEventListener('input', () => {
      if (checkValidity(input).valid) {
        input.classList.remove('form__input--invalid');
        input.previousElementSibling.innerHTML = '';
      }

      if (checkValidity()) {
        input.classList.remove('form__input--invalid');
        document.querySelector('.form__button').disabled = false;
      } else {
        document.querySelector('.form__button').disabled = true;
      }
    });
  });

  let checks = document.querySelectorAll("input[type='checkbox']");
  var max = 2;
  for (var i = 0; i < checks.length; i++)
    checks[i].onclick = selectiveCheck;
  function selectiveCheck (event) {
    var checkedChecks = document.querySelectorAll("input[type='checkbox']:checked");
    if (checkedChecks.length >= max + 1)
      return false;
  }

  // FOOTER
  body.appendChild(footer);
});

fetch('../books.json')
  .then((response) => response.json())
  .then((data) => {
    books = data;
  });

function createElement(tag, className, content, attr) {
  const fragment = new DocumentFragment(tag);
  const element = document.createElement(tag);
  console.log(element)
  element.classList.add(className);
  element.innerHTML = content || '';
  if (attr) {
    attr.forEach((item) => {
      element.setAttribute(item.name, item.value);
    });
  }
  return fragment.appendChild(element);
}

function checkValidity(input) {
  if (input)
    switch (input.name) {
      case 'name':
      case 'surname':
        return {
          valid: /^[a-zA-Z]{5,}$/.test(input.value),
          message: 'Invalid name',
        };
      case 'street':
        return {
          valid: /^[a-zA-Z0-9\s,'-]{5,}$/.test(input.value),
          message: 'Invalid street',
        };
      case 'houseNumber':
        return {
          valid: /^[0-9]{1,}$/.test(input.value),
          message: 'Invalid house number',
        };
      case 'flatNumber':
        return {
          valid: /^[0-9]+(-[0-9]+)?$/.test(input.value),
          message: 'Invalid flat number',
        };
      case 'date':
        return {
          valid: new Date(input.value) >= getTomorrow(),
          message: 'Invalid date',
        };
      default:
        return {
          valid: true,
        };
    }

  return Array.from(document.querySelectorAll('.form__input')).every(
    (input) => {
      return checkValidity(input).valid;
    },
  );
}

function getTomorrow() {
  const tomorrow = new Date(new Date().toISOString().split('T')[0]);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}
