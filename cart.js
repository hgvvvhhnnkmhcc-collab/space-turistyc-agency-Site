

function getCart() {
    try { return JSON.parse(localStorage.getItem('spaceCart') || '[]'); }
    catch { return []; }
}
function saveCart(cart) {
    localStorage.setItem('spaceCart', JSON.stringify(cart));
}


const REQUIRED_FIELDS = [
    { id: 'contact-name',  hintId: 'hint-name',  label: 'Введите имя',              validate: v => v.trim().length >= 2 },
    { id: 'contact-phone', hintId: 'hint-phone', label: 'Введите корректный телефон', validate: v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()) },
    { id: 'contact-email', hintId: 'hint-email', label: 'Введите корректный email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
];

function checkFormValidity() {
    let filled = 0;

    REQUIRED_FIELDS.forEach(field => {
        const input = document.getElementById(field.id);
        const hint  = document.getElementById(field.hintId);
        if (!input) return;

        const val   = input.value;
        const valid = field.validate(val);
        const empty = val.trim() === '';


        if (!empty && !valid) {
            input.classList.add('input-error');
            input.classList.remove('input-ok');
            if (hint) { hint.textContent = field.label; hint.className = 'field-hint error'; }
        } else if (valid) {
            input.classList.remove('input-error');
            input.classList.add('input-ok');
            if (hint) { hint.textContent = '✓'; hint.className = 'field-hint ok'; }
            filled++;
        } else {
            input.classList.remove('input-error', 'input-ok');
            if (hint) { hint.textContent = ''; hint.className = 'field-hint'; }
        }
    });

    const total   = REQUIRED_FIELDS.length;
    const pct     = Math.round((filled / total) * 100);
    const bar     = document.getElementById('fill-bar-inner');
    const label   = document.getElementById('fill-label');
    const hint    = document.getElementById('checkout-hint');
    const btn     = document.getElementById('checkout-btn');

    if (bar) {
        bar.style.width = pct + '%';
        bar.classList.toggle('full', filled === total);
    }
    if (label) {
        label.textContent = filled === total
            ? '✓ Всё заполнено — можно оформлять!'
            : `Заполнено ${filled} из ${total} обязательных полей`;
        label.classList.toggle('ready', filled === total);
    }
    if (hint)  hint.classList.toggle('hidden', filled === total);
    if (btn)   btn.disabled = filled < total;

    return filled === total;
}


REQUIRED_FIELDS.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('blur',  checkFormValidity);
    }
});

function updateBadge(count) {
    document.querySelectorAll('#cart-count-badge').forEach(b => {
        b.textContent = count;
        b.classList.add('bump');
        setTimeout(() => b.classList.remove('bump'), 300);
    });
}

function renderCart() {
    const cart      = getCart();
    const emptyEl   = document.getElementById('cart-empty');
    const mainEl    = document.getElementById('cart-main');
    const itemsEl   = document.getElementById('cart-items');

    updateBadge(cart.length);

    if (cart.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (mainEl)  mainEl.style.display  = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (mainEl)  mainEl.style.display  = 'block';


    let totalMin = 0;
    cart.forEach(t => {
        const num = parseInt((t.price || '').replace(/\D/g, ''));
        if (!isNaN(num)) totalMin += num;
    });
    const countEl = document.getElementById('summary-count');
    const priceEl = document.getElementById('summary-price');
    if (countEl) countEl.textContent = cart.length;
    if (priceEl) priceEl.textContent = 'от ' + totalMin.toLocaleString('ru-RU') + ' ₽';

    if (itemsEl) {
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
                        ${tour.people   ? `<span>👥 ${tour.people}</span>`   : ''}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">${tour.price}</div>
                    <button class="btn-cancel" onclick="removeFromCart(${idx})">✕ Отменить бронь</button>
                </div>
            </div>
        `).join('');
    }


    checkFormValidity();
}

function removeFromCart(idx) {
    const item = document.getElementById(`cart-item-${idx}`);
    if (item) {
        item.classList.add('removing');
        setTimeout(() => {
            const cart = getCart();
            cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
        }, 380);
    }
}


const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
        if (!checkFormValidity()) return;

        const name  = document.getElementById('contact-name')?.value.trim()  || '';
        const phone = document.getElementById('contact-phone')?.value.trim() || '';
        const email = document.getElementById('contact-email')?.value.trim() || '';
        const wish  = document.getElementById('contact-wish')?.value.trim()  || '';
        const resp  = document.getElementById('checkout-response');

      
        console.log('Заказ:', { name, phone, email, wish, tours: getCart() });

        this.disabled    = true;
        this.textContent = '✓ Заявка отправлена!';
        this.style.background = 'linear-gradient(135deg, #00ff88, #00b360)';

        if (resp) {
            resp.textContent = `Спасибо, ${name}! Менеджер свяжется с вами по номеру ${phone} или отправит письмо на почту ${email} в течение 1 рабочего дня.`;
            resp.style.color = '#00ff88';
        }
    });
}

renderCart();