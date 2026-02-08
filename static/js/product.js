import { getProduct } from "./api";

const container = document.getElementById("product-container");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProduct() {
    const p = await getProduct(id);

    container.innerHTML = 
    `
        <div class="product-page">
            <img src="${p.thumbnail}">
            <div>
                <h1>${p.title}</h1>
                <p>${p.description}</p>
                <h2>$${p.price}<h2>
                <button class="btn">Add to cart</button>
            </div>
        </div>
    `;
}

loadProduct();