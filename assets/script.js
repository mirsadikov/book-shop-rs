const body = document.querySelector('body');
const footer = createElement(
  'footer',
  'footer',
  '<p>Book Shop | zeyds  &copy;</p>',
);
const main = createElement('main', 'main');
const booksEl = createElement('div', 'books');
const booksList = createElement('div', 'books__list');
const cartEl = createElement('div', 'cart');
let books = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // HEADER

  const headerContent = `
<a href="/"><h1> Book Shop </h1></a>
<div class="hero">
<p>Weclome to the Book Shop!</p>
</div>`;
  const headerEl = createElement('header', 'header', headerContent);
  body.appendChild(headerEl);

  // MAIN
  body.appendChild(main);
  const mainContainer = createElement('div', 'container');
  main.insertAdjacentElement('beforeend', mainContainer);

  // BOOKS
  mainContainer.appendChild(booksEl);
  booksEl.insertAdjacentHTML('afterbegin', '<h2>Books Catalog</h2>');
  booksEl.insertAdjacentElement('beforeend', booksList);

  booksList.addEventListener('click', (e) => {
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
  mainContainer.insertAdjacentElement('beforeend', cartEl);
  const cartContent = `<h2>Cart</h2>
  <div class="cart__items"></div>
  <div class="cart__info">
  <h3 class="cart__total"></h3>
  <a href="/order.html" class="cart__confirm">Confirm cart</a>
  </div>`;
  cartEl.insertAdjacentHTML('beforeend', cartContent);
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  renderCart(cart);
  document.querySelector('.cart__items').addEventListener('click', (e) => {
    if (e.target.classList.contains('cart__item-remove')) {
      console.log('remove');
      const cartItemEl = e.target.closest('.cart__item');
      const cartItemId = cartItemEl.dataset.id;
      removeBookFromCart(cartItemId, cart);
    }
  });
  document.querySelector('.cart__confirm').addEventListener('click', (e) => {
    if (cart.length === 0) {
      e.preventDefault();
      alert('Your cart is empty');
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
  body.appendChild(footer);
});

fetch('../books.json')
  .then((response) => response.json())
  .then((data) => {
    books = data;
    renderBooks(books);
  });

function renderCart(cart) {
  const cartFragment = document.createDocumentFragment();
  cart.forEach((book) => {
    const cartItem = createElement('div', 'cart__item');
    cartItem.dataset.id = book.id;
    const cartItemContent = `
      <img class="cart__item-img" src="/img/${book.imageLink}" alt="${
      book.title
    }" />
      <h3>${book.title}</h3>
      <p class="cart__item-price">$${book.price.toFixed(2)}</p>
      <p>${book.author}</p>
      <button class="cart__item-remove cart__item-btn"><i class="ai-cross cart__item-remove"></i></button>`;
    cartItem.insertAdjacentHTML('beforeend', cartItemContent);
    cartFragment.appendChild(cartItem);
  });

  cartEl.querySelector('.cart__items').innerHTML = '';
  cartEl.querySelector('.cart__items').appendChild(cartFragment); 
  const total = cart.reduce((acc, book) => acc + book.price, 0).toFixed(2);
  cartEl.querySelector('.cart__total').innerHTML = `Total: $${total}`;
}

function renderBooks(books) {
  const booksFragment = document.createDocumentFragment();
  books.forEach((book) => {
    const bookEl = createElement('div', 'book');
    bookEl.dataset.id = book.id;
    bookEl.innerHTML = `
    <img class="book__img" src="/img/${book.imageLink}" alt="${
      book.title
    }" draggable="true"/>
    <h3>${book.title}</h3>
    <p><b>Author:</b> ${book.author}</p>
    <p><b>Price:</b> $${book.price.toFixed(2)}</p>
    <p class="book__desc">${book.description}</p>
    <div class="book__btns">
    <button class="book__show-more">Show more</button>
    <button class="book__add-cart">Add to cart</button>
    </div>`;
    booksFragment.appendChild(bookEl);
  });
  booksList.appendChild(booksFragment);
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

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerHTML = content || '';
  return element;
}
