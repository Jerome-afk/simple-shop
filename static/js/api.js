const API_BASE = 'https://dummyjson.com';

async function apiFetch(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error('API request failed');
    return res.json();
}

async function fetchProducts({ search = '', category = '' } = {}) {
    if (search) {
        return apiFetch(`/products/search?q=${encodeURIComponent(search)}`);
    }
    if (category) {
        return apiFetch(`/products/category/${encodeURIComponent(category)}`);
    }
    return apiFetch('/products');
}