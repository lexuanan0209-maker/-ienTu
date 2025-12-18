// chuyendoi.js - QUẢN LÝ SẢN PHẨM, LỌC, SẮP XẾP, GIỎ HÀNG

// ===============================
// ====== DỮ LIỆU SẢN PHẨM =======
// ===============================
const products = [
    // ==== Điện thoại ====
    { id: 1, name: "Điện thoại Samsung Galaxy S23", price: "21990000", img: "/images/dt23.jpg", category: "Điện thoại", origin: "Hàn Quốc", sold: 1532, rate: 4.8 },
    { id: 2, name: "Điện thoại iPhone 15 Pro Max", price: "30990000", img: "https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-pro-max-thumb-600x600.jpg", category: "Điện thoại", origin: "Mỹ", sold: 2541, rate: 4.9 },
    { id: 3, name: "Xiaomi 13T Pro", price: "16990000", img: "https://cdn.tgdd.vn/Products/Images/42/306782/xiaomi-13t-pro-thumb-600x600.jpg", category: "Điện thoại", origin: "Trung Quốc", sold: 850, rate: 4.7 },
    // ... thêm các sản phẩm còn lại
    { id: 53, name: "Nồi chiên không dầu Lock&Lock", price: "2490000", img: "https://cdn.tgdd.vn/Products/Images/4619/236968/camera-hanh-trinh-vietmap-c61-pro-thumb-600x600.jpg", category: "Gia dụng", origin: "Hàn Quốc", sold: 1500, rate: 4.6 }
];

// Biến toàn cục lưu trữ sản phẩm hiện tại (sau lọc/sắp xếp)
let currentProducts = [...products];

// Bộ lọc mặc định
let currentFilter = {
    category: '🌐 Tất cả',
    priceRange: '',
    sortType: '',
    popular: false,
    newest: false
};

// ===============================
// ====== HÀM HỖ TRỢ ======
// ===============================

// Lấy key cá nhân hóa theo user
function getCurrentUserKey(suffix) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? `${suffix}_${currentUser.username}` : null;
}
window.getCurrentUserKey = getCurrentUserKey;

// Lấy dữ liệu sản phẩm mới nhất (có thể đã cập nhật)
function getSourceProducts() {
    const storedProducts = localStorage.getItem('updatedProducts');
    return storedProducts ? JSON.parse(storedProducts) : products;
}

// ===============================
// ====== HIỂN THỊ SẢN PHẨM ======
// ===============================
function showProducts(productsArray) {
    const productList = document.getElementById('productList');
    if (!productList) return;

    productList.innerHTML = '';

    if (productsArray.length === 0) {
        productList.innerHTML = '<p style="text-align:center; color:#ff5722;">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    productsArray.forEach(product => {
        const formattedPrice = parseInt(product.price).toLocaleString('vi-VN') + '₫';
        const stars = '★'.repeat(Math.round(product.rate)) + '☆'.repeat(5 - Math.round(product.rate));

        productList.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}" class="product-img">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formattedPrice}</p>
                <div class="product-info">
                    <p class="product-sold">Đã bán: ${product.sold}</p>
                    <p class="product-rating">${stars} (${product.rate})</p>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}
window.showProducts = showProducts;

// ===============================
// ====== LỌC VÀ SẮP XẾP ======
// ===============================
function applyFiltersAndSorts() {
    let filteredProducts = getSourceProducts();

    // Filter theo category
    if (currentFilter.category !== '🌐 Tất cả') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter.category);
    }

    // Filter theo tìm kiếm
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Filter theo khoảng giá
    if (currentFilter.priceRange === 'low') filteredProducts = filteredProducts.filter(p => parseInt(p.price) < 3000000);
    if (currentFilter.priceRange === 'high') filteredProducts = filteredProducts.filter(p => parseInt(p.price) >= 3000000);

    // Filter nhanh (popular/newest)
    if (currentFilter.popular) filteredProducts.sort((a, b) => b.sold - a.sold);
    else if (currentFilter.newest) filteredProducts.sort((a, b) => b.id - a.id);

    // Sắp xếp giá
    if (currentFilter.sortType === 'asc') filteredProducts.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    else if (currentFilter.sortType === 'desc') filteredProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price));

    // Cập nhật biến toàn cục và hiển thị
    currentProducts = filteredProducts;
    showProducts(currentProducts);
}
window.applyFiltersAndSorts = applyFiltersAndSorts;

// ===============================
// ====== HÀM GỌI TỪ HTML ======
// ===============================
function searchProduct() { applyFiltersAndSorts(); }
window.searchProduct = searchProduct;

function sortProducts() {
    currentFilter.sortType = document.getElementById('sort-price').value;
    currentFilter.popular = false;
    currentFilter.newest = false;
    applyFiltersAndSorts();
}
window.sortProducts = sortProducts;

function filterCategory(category) {
    currentFilter.category = category;
    document.querySelectorAll('.sidebar li').forEach(el => el.classList.remove('active'));
    const activeEl = Array.from(document.querySelectorAll('.sidebar li')).find(el => el.textContent.includes(category));
    if (activeEl) activeEl.classList.add('active');
    applyFiltersAndSorts();
}
window.filterCategory = filterCategory;
window.showAll = () => filterCategory('🌐 Tất cả');

function filterProducts(type = '') {
    const priceRangeValue = document.getElementById('filter-price-range').value;

    if (type === 'popular') { currentFilter.popular = true; currentFilter.newest = false; }
    else if (type === 'newest') { currentFilter.popular = false; currentFilter.newest = true; }
    else { currentFilter.priceRange = priceRangeValue; currentFilter.popular = false; currentFilter.newest = false; }

    applyFiltersAndSorts();
}
window.filterProducts = filterProducts;

// ===============================
// ====== GIỎ HÀNG ======
// ===============================
function addToCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!"); return; }

    const cartKey = getCurrentUserKey('cart');
    const product = getSourceProducts().find(p => p.id === productId);
    if (!product) { alert("Sản phẩm không tồn tại!"); return; }

    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        alert(`Đã cập nhật số lượng ${product.name} (x${existingItem.quantity})!`);
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price.replace(/\D/g, ''), img: product.img, quantity: 1 });
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    if (typeof loadCart === 'function') loadCart();
}
window.addToCart = addToCart;

// ===============================
// ====== CẬP NHẬT ĐÃ BÁN ======
// ===============================
function updateProductSold(productId, quantity = 1) {
    let productsToUpdate = getSourceProducts();
    const product = productsToUpdate.find(p => p.id === productId);
    if (!product) { console.error(`Sản phẩm với ID ${productId} không tồn tại.`); return false; }

    product.sold += quantity;
    localStorage.setItem('updatedProducts', JSON.stringify(productsToUpdate));
    return true;
}
window.updateProductSold = updateProductSold;

// ===============================
// ====== TẢI TRANG ======
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    currentProducts = [...getSourceProducts()];
    applyFiltersAndSorts();
});
