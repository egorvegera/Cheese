// Хранилище корзины (в памяти)
let cartItems = [];

// Функция для рендеринга карточек сыров
function renderCheeses(cheeses, container) {
  container.innerHTML = cheeses.map(cheese => `
    <div class="col-lg-4 col-sm-6">
      <div class="product-card">
        <div class="product-card__thumb">
          <a href="#"><img src="${cheese.image}" alt="${cheese.name}"></a>
        </div>
        <div class="product-card__details">
          <h4><a href="#">${cheese.name}</a></h4>
          <p>${cheese.description}</p>
          <div class="product-card__bottom-details d-flex justify-content-between">
            <div class="product-card__price">${cheese.price} руб.</div>
            <div class="product-card__links">
              <a href="#product-card" onclick="addToCart(${cheese.id}, '${cheese.name}', ${cheese.price})">В корзину</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Функция для рендеринга корзины
function renderCart() {
  const cartList = document.querySelector('.cart__list');
  if (cartItems.length === 0) {
    cartList.innerHTML = '<p>Корзина пуста</p>';
  } else {
    cartList.innerHTML = cartItems.map(item => `
      <div class="cart__item">
        <span class="cart__item-name">${item.name}</span>
        <span class="cart__item-price">${item.price} руб.</span>
        <span class="cart__item-quantity">x${item.quantity}</span>
      </div>
    `).join('');
  }
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector('.cart__total-amount').textContent = `${totalAmount} руб.`;
}

// Функция для добавления товара в корзину
function addToCart(id, name, price) {
  const existingItem = cartItems.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ id, name, price, quantity: 1 });
  }
  renderCart();
  alert(`Товар "${name}" добавлен в корзину!`);
}

// Функция для очистки корзины
function clearCart() {
  cartItems = [];
  renderCart();
}

// Функция для скрытия всех секций
function hideAllSections() {
  document.querySelectorAll('.products-section__category').forEach(section => {
    section.classList.add('products-section__category_hidden');
  });
}

// Функция для загрузки сыров по категории
async function loadCheeses(category) {
  try {
    const response = await fetch('/cheeses.json');
    const cheeses = await response.json();
    // Скрываем все секции
    hideAllSections();
    // Показываем выбранную секцию
    const section = document.querySelector(`#${category}`);
    section.classList.remove('products-section__category_hidden');
    // Загружаем сыры для выбранной категории
    const filteredCheeses = cheeses.filter(cheese => cheese.category === category);
    const container = section.querySelector('.products-section__list');
    renderCheeses(filteredCheeses, container);
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

// Загрузка сыров для всех категорий и рендеринг корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Показываем все секции и загружаем все категории
  ['italy', 'france', 'russia'].forEach(category => {
    const section = document.querySelector(`#${category}`);
    section.classList.remove('products-section__category_hidden');
    loadCheeses(category);
  });

  // Инициализация корзины
  renderCart();

  // Обработчики кликов по категориям и корзине
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const category = item.closest('a').getAttribute('href').slice(1); // Например, #italy -> italy
      loadCheeses(category);
      // Прокрутка к секции
      document.querySelector(`#${category}`).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Обработчик клика по ссылке "Корзина"
  document.querySelectorAll('a[href="#cart"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllSections(); // Скрываем категории
      document.querySelector('#cart').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Обработчик кнопки очистки корзины
  document.querySelector('.cart__clear-btn').addEventListener('click', clearCart);
});