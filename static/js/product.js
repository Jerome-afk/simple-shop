async function loadProducts({ search = '', category = '', gridId }) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '<p>Loading...</p>';

    try {
        const data = await fetchProducts({ search, category });
        renderProducts(data.products || [], grid);
    } catch (err) {
        grid.innerHTML = '<p>Error loading products.</p>';
        console.error(err);
    }
}

function renderProducts(products, grid) {
    grid.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${p.thumbnail}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>KES ${p.price.toFixed(2)}</p>
            <p>${p.description.slice(0, 60)}...</p>
            <button class="btn btn-secondary add-to-cart"
                data-id="${p.id}"
                data-title="${p.title}"
                data-price="${p.price}"
                data-thumbnail="${p.thumbnail}">
                Add to cart
            </button>
        `;

        grid.appendChild(card);
    });
}

/* Event Delegation */
document.addEventListener('click', e => {
    if (!e.target.classList.contains('add-to-cart')) return;

    const btn = e.target;
    addItemToCart({
        id: Number(btn.dataset.id),
        title: btn.dataset.title,
        price: Number(btn.dataset.price),
        thumbnail: btn.dataset.thumbnail
    });

    alert(`${btn.dataset.title} added to cart`);
});

function filterProducts() {
    loadProducts({
        search: document.getElementById('search')?.value.trim(),
        category: document.getElementById('category')?.value,
        gridId: 'product-grid'
    });
}
