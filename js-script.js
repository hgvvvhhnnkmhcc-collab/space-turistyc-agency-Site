function getCart() {
    try { return JSON.parse(localStorage.getItem('spaceCart') || '[]'); }
    catch { return []; }
}
function saveCart(cart) {
    localStorage.setItem('spaceCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badges = document.querySelectorAll('#cart-count-badge');
    const count = getCart().length;
    badges.forEach(b => {
        b.textContent = count;
        b.classList.add('bump');
        setTimeout(() => b.classList.remove('bump'), 300);
    });
}
 

function collectTourData(card) {
    const imgEl = card.querySelector('.card-image');
    const badgeEl = card.querySelector('.card-badge');
    const titleEl = card.querySelector('.card-title');
    const descEl = card.querySelector('.card-text');
    const priceEl = card.querySelector('.card-price');
    const metaSpans = card.querySelectorAll('.card-meta span');
    return {
        id: titleEl ? titleEl.textContent.trim() : Math.random().toString(36).slice(2),
        title: titleEl ? titleEl.textContent.trim() : 'Тур',
        desc: descEl ? descEl.textContent.trim() : '',
        price: priceEl ? priceEl.textContent.trim() : '',
        badge: badgeEl ? badgeEl.textContent.trim() : '',
        img: imgEl ? imgEl.getAttribute('src') : '',
        duration: metaSpans[0] ? metaSpans[0].textContent.replace('⏱', '').trim() : '',
        people: metaSpans[1] ? metaSpans[1].textContent.replace('👥', '').trim() : '',
    };
}
 
document.querySelectorAll('.card-button').forEach(button => {

    const card = button.closest('.card');
    const titleEl = card ? card.querySelector('.card-title') : null;
    const tourId = titleEl ? titleEl.textContent.trim() : null;
    const cart = getCart();
    const alreadyBooked = tourId && cart.some(t => t.id === tourId);
 
    if (alreadyBooked) {
        setBookedState(button, true);
    }
 
    button.addEventListener('click', function () {
        const card = this.closest('.card');
        const acceptText = card.querySelector('.card-accept');
        const titleEl = card.querySelector('.card-title');
        const tourId = titleEl ? titleEl.textContent.trim() : null;
        let cart = getCart();
        const isBooked = cart.some(t => t.id === tourId);
 
        if (!isBooked) {
       
            const tourData = collectTourData(card);
            cart.push(tourData);
            saveCart(cart);
            setBookedState(this, true);
            acceptText.textContent = '✓ Тур добавлен в корзину!';
            acceptText.classList.add('visible');
            updateCartBadge();
        } else {

            cart = cart.filter(t => t.id !== tourId);
            saveCart(cart);
            setBookedState(this, false);
            acceptText.textContent = '';
            acceptText.classList.remove('visible');
            updateCartBadge();
        }
    });
});
 
function setBookedState(btn, booked) {
    if (booked) {
        btn.textContent = 'Отменить бронь';
        btn.style.color = '#ff4757';
        btn.style.background = 'rgba(255, 71, 87, 0.08)';
    } else {
        btn.textContent = 'Забронировать';
        btn.style.color = '';
        btn.style.background = '';
    }
}
 

(function injectCartIcon() {
    const nav = document.querySelector('.top-nav');
    if (!nav || nav.querySelector('.nav-cart-link')) return;
 
    const link = document.createElement('a');
    link.href = 'cart.html';
    link.className = 'nav-link nav-cart-link';
    link.innerHTML = '🛒 Корзина <span id="cart-count-badge" class="cart-badge">0</span>';
    nav.appendChild(link);
 
    updateCartBadge();
})();
 

document.querySelectorAll('.left-panel-button[data-section]').forEach(btn => {
    btn.addEventListener('click', function () {
        const sectionId = this.dataset.section;
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
 

 
const EMAILJS_SERVICE_ID  = 'service_lxd70jx';  
const EMAILJS_TEMPLATE_ID = 'template_ixs288e'; 
const EMAILJS_PUBLIC_KEY  = 'VwDwNdtYX3T7fbCyO';   
 
(function loadEmailJS() {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
    document.head.appendChild(s);
})();
 
const contactBtn = document.getElementById('contact-submit');
if (contactBtn) {
    contactBtn.addEventListener('click', function () {
        const nameEl  = document.querySelector('.contact-form input[type="text"]');
        const emailEl = document.querySelector('.contact-form input[type="email"]');
        const msgEl   = document.querySelector('.contact-form textarea');
        const resp    = document.getElementById('contact-response');
 
        const name    = nameEl  ? nameEl.value.trim()  : '';
        const email   = emailEl ? emailEl.value.trim() : '';
        const message = msgEl   ? msgEl.value.trim()   : '';
 
        if (!name || !email || !message) {
            resp.textContent = '⚠ Пожалуйста, заполните все поля.';
            resp.style.color = '#ffd700';
            return;
        }
 
  
        if (typeof emailjs !== 'undefined' &&
            EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
 
            this.disabled = true;
            this.textContent = 'Отправляем...';
 
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name:  name,
                from_email: email,
                message:    message,
                to_email:   'gg6527025@gmail.com',
            }).then(() => {
                resp.textContent = '✓ Сообщение отправлено! Ответим в течение 24 часов.';
                resp.style.color = '#00ff88';
                if (nameEl)  nameEl.value  = '';
                if (emailEl) emailEl.value = '';
                if (msgEl)   msgEl.value   = '';
                this.disabled = false;
                this.textContent = 'Отправить запрос';
            }).catch(err => {
                resp.textContent = '✗ Ошибка отправки. Напишите нам напрямую: gg6527025@gmail.com';
                resp.style.color = '#ff4757';
                this.disabled = false;
                this.textContent = 'Отправить запрос';
                console.error('EmailJS error:', err);
            });
 
        } else {
          
            const subject = encodeURIComponent(`Запрос от ${name} — Space Turisticks`);
            const body    = encodeURIComponent(`Имя: ${name}\nEmail: ${email}\n\n${message}`);
            window.location.href = `mailto:gg6527025@gmail.com?subject=${subject}&body=${body}`;
            resp.textContent = '✓ Открываем ваш почтовый клиент...';
            resp.style.color = '#00ff88';
        }
    });
}
 

(function () {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
 
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
 
    const STARS_COUNT = 280;
    const stars = Array.from({ length: STARS_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
    }));
 
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        stars.forEach(s => {
            const flicker = Math.sin(frame * s.speed * 0.05 + s.phase) * 0.3;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, s.alpha + flicker)})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();
 

(function () {
    const cards = document.querySelectorAll('.card, .dest-card');
    cards.forEach((card, i) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s`;
    });
 
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
 
    cards.forEach(card => observer.observe(card));
})();
 
