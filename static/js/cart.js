function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!container || !totalEl) return;

    const cart = getCart();
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.textContent = 'KES 0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement('div');
        row.className = 'cart-item';

        row.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" width="80" height="80">

            <div class="cart-info">
                <h4>${item.title}</h4>
                <p>KES ${item.price.toFixed(2)}</p>
                <p><strong>Subtotal:</strong> KES ${subtotal.toFixed(2)}</p>
            </div>

            <div class="quantity-controls">
                <button data-action="decrease" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${item.id}">+</button>
            </div>

            <button class="remove-btn" data-action="remove" data-id="${item.id}">
                Remove
            </button>
        `;

        container.appendChild(row);
    });

    totalEl.textContent = `KES ${total.toFixed(2)}`;
}


function addItemToCart({ id, title, price, thumbnail }) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id, title, price, thumbnail, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const count = getCart().reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

document.addEventListener('click', e => {
    const btn = e.target;
    const id = Number(btn.dataset.id);

    if (!id) return;

    switch (btn.dataset.action) {
        case 'increase':
            changeQuantity(id, 1);
            break;
        case 'decrease':
            changeQuantity(id, -1);
            break;
        case 'remove':
            removeFromCart(id);
            break;
    }
});

function changeQuantity(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart(cart);
    loadCart();
    updateCartCount();
}

function removeFromCart(id) {
    saveCart(getCart().filter(i => i.id !== id));
    loadCart();
    updateCartCount();
}
