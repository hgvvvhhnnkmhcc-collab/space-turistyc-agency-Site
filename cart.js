// ===== CART.JS — логика страницы корзины =====

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('spaceCart') || '[]');
    } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('spaceCart', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const itemsEl = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const summaryEl = document.getElementById('cart-summary');

    if (!itemsEl) return;

    updateBadge(cart.length);

    if (cart.length === 0) {
        emptyEl.style.display = 'block';
        itemsEl.style.display = 'none';
        summaryEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    itemsEl.style.display = 'flex';
    summaryEl.style.display = 'flex';

    // Считаем итого
    let totalMin = 0;
    cart.forEach(t => {
        const num = parseInt(t.price.replace(/\D/g, ''));
        if (!isNaN(num)) totalMin += num;
    });

    document.getElementById('summary-count').textContent = cart.length;
    document.getElementById('summary-price').textContent =
        'от ' + totalMin.toLocaleString('ru-RU') + ' ₽';

    // Рендер карточек
    itemsEl.innerHTML = cart.map((tour, idx) => `
        <div class="cart-item" id="cart-item-${idx}">
            ${tour.img
                ? `<img class="cart-item-img" src="${tour.img}" alt="${tour.title}">`
                : `<div class="cart-item-img-placeholder">🚀</div>`}
            <div class="cart-item-info">
                ${tour.badge ? `<div class="cart-item-badge">${tour.badge}</div>` : ''}
                <h3 class="cart-item-title">${tour.title}</h3>
                <p class="cart-item-desc">${tour.desc}</p>
                <div class="cart-item-meta">
                    ${tour.duration ? `<span>⏱ ${tour.duration}</span>` : ''}
                    ${tour.people ? `<span>👥 ${tour.people}</span>` : ''}
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-price">${tour.price}</div>
                <button class="btn-cancel" onclick="removeFromCart(${idx})">✕ Отменить бронь</button>
            </div>
        </div>
    `).join('');
}

function removeFromCart(idx) {
    const item = document.getElementById(`cart-item-${idx}`);
    if (item) {
        item.classList.add('removing');
        setTimeout(() => {
            const cart = getCart();
            cart.splice(idx, 1);
            saveCart(cart);
            // Синхронизируем кнопки на главной (если открыта в другой вкладке — не нужно)
            renderCart();
        }, 380);
    }
}

function updateBadge(count) {
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
        badge.textContent = count;
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 300);
    }
}

// Кнопка "Оформить заказ"
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
        const resp = document.getElementById('checkout-response');
        resp.textContent = '✓ Ваша заявка отправлена! Менеджер свяжется с вами в течение 1 рабочего дня.';
        resp.style.color = 'var(--green, #00ff88)';
        this.disabled = true;
        this.style.opacity = '0.6';
    });
}

renderCart();
