import { getProductsByCategory } from "./api";

const params = new URLSearchParams(window.location.search);
const category = params.get("name");

document.getElementById("category-title").textContent = category;

const grid = document.getElementById("category-grid");

async function loadCategory() {
    const data = await getProductsByCategory(category);
    grid.innerHTML = data.products.map(p => 
        `
            <div class="product-card">
                <img src="${p.thumbnail}">
                <h3>${p.title}</h3>
                <p>$${p.price}</p>
                <a href="product.html?id=${p.id}>View</a>
            </div>
        `
    ).join("");
}

loadCategory();