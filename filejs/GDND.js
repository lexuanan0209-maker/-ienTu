// GDND.js - QUẢN LÝ NGƯỜI DÙNG (HOÀN CHỈNH VỚI AVATAR)

// --- KEY CHUNG ---
const CART_STORAGE_KEY = 'cart';
const ORDER_STORAGE_KEY = 'userOrders';

// --- SẢN PHẨM GỢI Ý ---
const products = [
    { name: "Tai nghe Bluetooth", price: "350.000₫", img: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Tai+nghe" },
    { name: "Chuột không dây", price: "250.000₫", img: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Chuot" },
    { name: "Bàn phím cơ", price: "800.000₫", img: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Ban+phim" },
    { name: "Sạc dự phòng", price: "400.000₫", img: "https://via.placeholder.com/150/FFFF00/000000?text=Sac+du+phong" },
];

// --- HIỂN THỊ TÊN NGƯỜI DÙNG VÀ AVATAR ---
function displayUserName() {
    const userNameEl = document.getElementById('userNameDisplay');
    const userPhoneEl = document.getElementById('userPhoneDisplay');
    const avatarEl = document.querySelector('.user-profile img.avatar-large');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const nameToDisplay = currentUser.displayName || currentUser.username;
    if (userNameEl) userNameEl.innerHTML = `${nameToDisplay} <span class="verified-icon">✅</span>`;
    if (userPhoneEl) userPhoneEl.innerHTML = `Số điện thoại: <b>${currentUser.phone || 'Chưa cập nhật'}</b>`;

    // --- Load ảnh đại diện ---
    if (avatarEl) {
        avatarEl.src = currentUser.avatarUrl || "https://via.placeholder.com/100/40e0d0/ffffff?text=AVT";
    }
}
window.displayUserName = displayUserName;

// --- HIỂN THỊ ĐƠN HÀNG ---
function hienThiDonHang(status) {
    const orderContentEl = document.getElementById('order-content');
    const orderButtons = document.querySelectorAll('.order-status button');
    if (!orderContentEl) return;

    orderButtons.forEach(btn => btn.classList.toggle('active-order-btn', btn.textContent.trim() === status));

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.username : '';
    let orders = (JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || []).filter(o => o.username === username);

    if (status === 'Đánh giá') {
        orders = orders.filter(o => o.status === 'Đã nhận hàng');
    } else {
        orders = orders.filter(o => o.status === status);
    }

    if (orders.length === 0) {
        orderContentEl.innerHTML = `<p class="note">Không có đơn hàng nào ở trạng thái "${status}"</p>`;
        return;
    }

    orderContentEl.innerHTML = orders.reverse().map(order => {
        const items = order.items.map(i => `${i.name} (x${i.quantity})`).join('<br>');
        const price = Number(String(order.totalPrice).replace(/[^\d]/g, '')).toLocaleString('vi-VN');
        const ratingHTML = order.status === 'Đã nhận hàng' 
            ? (window.hienThiRating ? window.hienThiRating(order.id) 
            : '<button class="rating-btn" onclick="openRatingModal(\'Sản phẩm trong đơn hàng\', \'modal\')">Đánh giá ngay</button>')
            : '';

        return `<div class="order-item">
            <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
            <p><strong>Ngày đặt:</strong> ${order.date}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge status-${order.status.replace(/\s/g, '-')}" >${order.status}</span></p>
            <p><strong>Sản phẩm:</strong><br>${items}</p>
            <p><strong>Tổng tiền:</strong> ${price}₫</p>
            ${ratingHTML ? `<div class="rating-section">${ratingHTML}</div>` : ''}
        </div>`;
    }).join('');
}
window.hienThiDonHang = hienThiDonHang;

// --- HỖ TRỢ NGƯỜI DÙNG ---
function hienThiHoTro(option) {
    const supportContent = document.getElementById('support-content');
    if (!supportContent) return;
    supportContent.innerHTML = '';
    supportContent.style.padding = '15px';

    if (option === 'Trung tâm trợ giúp') {
        supportContent.innerHTML = `
            <h3>🔍 Các Chủ đề Trợ giúp Phổ biến</h3>
            <div class="support-topic"><h4>1. Vấn đề Đơn hàng & Vận chuyển</h4><p>Theo dõi đơn hàng ở đâu?</p></div>
            <div class="support-topic"><h4>2. Đổi trả & Hoàn tiền</h4><p>Chính sách đổi trả, hoàn tiền?</p></div>
            <div class="support-topic"><h4>3. Tài khoản & Bảo mật</h4><p>Cách đổi mật khẩu, cập nhật thông tin?</p></div>
            <p class="mt-20">Vẫn chưa tìm thấy câu trả lời? Sử dụng "Trò chuyện với Admin".</p>`;
    } else if (option === 'Trò chuyện với admin') {
        supportContent.innerHTML = `
            <h3>💬 Trò chuyện Trực tuyến với Admin</h3>
            <p>Bấm vào nút dưới đây để mở giao diện trò chuyện riêng biệt.</p>
            <button class="chat-open-btn" onclick="window.location.href = 'chat.html';">Mở Cửa sổ Chat (Khách hàng)</button>`;
    }
}
window.hienThiHoTro = hienThiHoTro;

// --- KHỞI TẠO TRANG ---
document.addEventListener('DOMContentLoaded', () => {
    displayUserName();
    hienThiDonHang('Chờ xác nhận');

    const suggestionsEl = document.getElementById('suggest-products');
    if (suggestionsEl) {
        suggestionsEl.innerHTML = products.map(p => `
            <div class="product">
                <img src="${p.img}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>${p.price}</p>
            </div>`).join('');
    }

    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) editBtn.addEventListener('click', () => window.location.href = 'giaodienhoso.html');
});

// --- SỰ KIỆN ĐƠN HÀNG CẬP NHẬT ---
window.addEventListener('orderUpdated', () => {
    const currentStatusEl = document.querySelector('.order-status button.active-order-btn');
    hienThiDonHang(currentStatusEl ? currentStatusEl.textContent.trim() : 'Chờ xác nhận');
});
