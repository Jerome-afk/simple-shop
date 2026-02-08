document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (document.getElementById('featured-grid')) {
        loadProducts({ gridId: 'featured-grid' })
            .then(() => {
                [...document.querySelectorAll('#featured-grid .product-card')]
                    .slice(6)
                    .forEach(el => el.remove());
            });
    }

    if (document.getElementById('product-grid')) {
        loadProducts({ gridId: 'product-grid' });
    }

    if (document.getElementById('cart-items')) {
        loadCart();
    }
});
