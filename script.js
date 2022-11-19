const body = document.querySelector('body');
const headerEl = document.createElement('header');
const footer = document.createElement('footer');
const main = document.createElement('main');
const booksEl = document.createElement('div');
const cartEl = document.createElement('div');
let books = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // HEADER
  body.appendChild(headerEl);
  const headerContent = `<div class="container">
  <a href="/"><h1> Book Shop </h1></a>
  <div class="hero">
  <p>Weclome to the Book Shop!</p>
  </div>
  </div>`;
  headerEl.classList.add('header');
  headerEl.insertAdjacentHTML('beforeend', headerContent);

  // MAIN
  body.appendChild(main);
  main.classList.add('main');
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('container');
  main.insertAdjacentElement('beforeend', mainContainer);

  // BOOKS
  booksEl.classList.add('books');
  mainContainer.appendChild(booksEl);
  booksEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('book__add-cart')) {
      const bookEl = e.target.closest('.book');
      const bookId = bookEl.dataset.id;
      const bookObj = books.find((book) => book.id == bookId);
      console.log(bookObj);
      addBookToCart(bookObj, cart);
    }
    if (e.target.classList.contains('book__show-more')) {
      const bookEl = e.target.closest('.book');
      bookEl.classList.toggle('book--show-more');

      if (bookEl.classList.contains('book--show-more')) {
        e.target.textContent = 'Hide';
      } else {
        e.target.textContent = 'Show more';
      }
    }
  });

  booksEl.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('book__img')) {
      e.dataTransfer.setData(
        'text/plain',
        e.target.closest('.book').dataset.id,
      );
    }
  });

  // CART
  cartEl.classList.add('cart');
  mainContainer.insertAdjacentElement('beforeend', cartEl);
  const cartContent = `<h2>Cart</h2>
  <div class="cart__items"></div>
  <h3 class="cart__total"></h3>`;
  cartEl.insertAdjacentHTML('beforeend', cartContent);
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  renderCart(cart);
  document.querySelector('.cart__items').addEventListener('click', (e) => {
    if (e.target.classList.contains('cart__item-remove')) {
      const cartItemEl = e.target.closest('.cart__item');
      const cartItemId = cartItemEl.dataset.id;
      removeBookFromCart(cartItemId, cart);
    }
  });

  cartEl.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  cartEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const bookId = e.dataTransfer.getData('text/plain');
    const bookObj = books.find((book) => book.id == bookId);
    addBookToCart(bookObj, cart);
  });

  // FOOTER
  footer.classList.add('footer');
  body.appendChild(footer);
});

fetch('../books.json')
  .then((response) => response.json())
  .then((data) => {
    books = data;
    renderBooks(books);
  });

function renderCart(cart) {
  const cartContent = cart
    .map((book) => {
      return `<div class="cart__item" data-id="${book.id}">
      <img class="cart__item-img" src="/img/${book.imageLink}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.price}</p>
      <button class="cart__item-remove">Remove</button>
      </div>`;
    })
    .join('');
  cartEl.querySelector('.cart__items').innerHTML = cartContent;
  const total = cart.reduce((acc, book) => acc + book.price, 0).toFixed(2);
  cartEl.querySelector('.cart__total').innerHTML = `Total: $${total}`;
}

function renderBooks(books) {
  const booksContent = `
    ${books
      .map((book) => {
        return `<div class="book" data-id="${book.id}">
        <img class="book__img" src="/img/${book.imageLink}" alt="${book.title}" draggable="true"/>
        <h2>${book.title}</h2>
        <p>${book.author}</p>
        <p class="book__desc">${book.description}</p>
        <button class="book__show-more">Show more</button>
        <p>${book.price}</p>
        <button class="book__add-cart">Add to cart</button>
        </div>`;
      })
      .join('')}`;
  booksEl.insertAdjacentHTML('afterbegin', booksContent);
}

function addBookToCart(book, cart) {
  const bookInCart = cart.find((item) => item.id === book.id);
  if (!bookInCart) {
    cart.push(book);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart(cart);
}

function removeBookFromCart(id, cart) {
  const bookIndex = cart.findIndex((item) => item.id == id);
  cart.splice(bookIndex, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart(cart);
}
