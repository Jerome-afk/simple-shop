// Base API URL
const API_BASE = 'https://dummyjson.com';

async function loadProducts(search = '', category = '', gridId) {
    let url = `${API_BASE}/products`;
    if (search) {
        url = `${API_BASE}/products/search?q=${encodeURIComponent(search)}`;
    } else if (category) {
        url = `${API_BASE}/products/category/${encodeURIComponent(category)}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayProducts(data.products || [], gridId);
    } catch (err) {
        console.error('API error:', err);
        document.getElementById(gridId).innerHTML = '<p> Error loading products. Please try again.</p>';
    }
}

function displayProducts(prodList, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    prodList.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>KES ${product.price.toFixed(2)}</p>
            <p>${product.description.substring(0, 60)}...</p>
            <button class="btn add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-thumbnail=${product.thumbnail}">Add to cart</button>
        `;
        grid.appendChild(card);
    });
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(e) {
    const btn = e.target;
    const id = parseInt(btn.dataset.id);
    const title = btn.dataset.title;
    const price = parseFloat(btn.dataset.price);
    const thumbnail = btn.dataset.thumbnail;

    let cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({id, title, price, thumbnail, quantity: 1});
    }

    saveCart(cart);
    alert(`${title} added to cart!`);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

function loadCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = 'KES 0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" width="80">
            <div>
                <h4>${item.title}</h4>
                <p>KES ${item.price.toFixed(2)} × ${item.quantity}</p>
                <p><strong>Subtotal: KES ${itemTotal.toFixed(2)}</strong></p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        container.appendChild(div);
    });

    document.getElementById('cart-total').textContent = `KES ${total.toFixed(2)}`;
}

function changeQuantity(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart(cart);
        loadCart();
        updateCartCount();
    }
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    loadCart();
    updateCartCount();
}

function filterProducts() {
    const search = document.getElementById('search').value.trim();
    const category = document.getElementById('category').value;
    loadProducts(search, category, 'product-grid');
}

if (document.getElementById('register-form')) {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (name && email && password.length >= 6) {
            const userId = Math.random().toString(36).substr(2, 9);
            document.cookie = `userId=${userId}; max-age=${30*24*60*60}; path=/`;
            document.getElementById('message').textContent = 'Registration successful! Cookie set for session.';
        } else {
            document.getElementById('message').textContent = 'Please fill all fields correctly.';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Home featured products (first 6)
    if (document.getElementById('featured-grid')) {
        loadProducts('', '', 'featured-grid').then(() => {
            // Limit to 6 for featured
            const cards = document.querySelectorAll('#featured-grid .product-card');
            Array.from(cards).slice(6).forEach(c => c.remove());
        });
    }

    // Products page load all
    if (document.getElementById('product-grid')) {
        loadProducts('', '', 'product-grid');
    }

    // Cart page
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});

