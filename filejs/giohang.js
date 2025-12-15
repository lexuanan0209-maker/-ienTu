// giohang.js - ĐÃ CẬP NHẬT HOÀN CHỈNH (Thêm username vào đơn hàng)

// === KEY CHUNG VÀ HÀM HỖ TRỢ ===
const ORDER_STORAGE_KEY = 'userOrders'; // Key lưu trữ tất cả đơn hàng
// Hàm hỗ trợ lấy key giỏ hàng cá nhân hóa (cần được định nghĩa hoặc lấy từ chuyendoi.js)
function getCurrentUserKey(suffix) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Trả về key localStorage: 'suffix_username'
    return currentUser ? `${suffix}_${currentUser.username}` : 'cart'; 
}

// === HÀM TẢI GIỎ HÀNG ===
function loadCart() {
  const cartKey = getCurrentUserKey('cart'); // Lấy key giỏ hàng cá nhân hóa
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const cartBody = document.getElementById("cartBody");
  const totalPriceEl = document.getElementById("totalPrice");

  if (cart.length === 0) {
    cartBody.innerHTML = "<tr><td colspan='6'>Giỏ hàng trống!</td></tr>";
    totalPriceEl.textContent = "0";
    return;
  }

  let total = 0;
  cartBody.innerHTML = "";
  cart.forEach((item) => {
    // Chuyển item.price từ string sang number để tính toán
    // Sử dụng biểu thức chính quy để loại bỏ tất cả các ký tự không phải số
    const price = parseInt(item.price.replace(/[^0-9]/g, '')); 
    const itemTotal = price * item.quantity;
    total += itemTotal;

    cartBody.innerHTML += `
      <tr>
        <td><img src="${item.img}" class="cart-img"></td>
        <td>${item.name}</td>
        <td>${price.toLocaleString('vi-VN')}₫</td>
        <td>
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          ${item.quantity}
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </td>
        <td>${itemTotal.toLocaleString('vi-VN')}₫</td>
        <td><button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button></td>
      </tr>
    `;
  });

  totalPriceEl.textContent = total.toLocaleString('vi-VN');
}
window.loadCart = loadCart;

// === HÀM THAY ĐỔI SỐ LƯỢNG ===
function changeQty(id, delta) {
    const cartKey = getCurrentUserKey('cart');
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        loadCart(); // Tải lại giỏ hàng
    }
}
window.changeQty = changeQty;

// === HÀM XÓA SẢN PHẨM ===
function removeItem(id) {
    const cartKey = getCurrentUserKey('cart');
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const initialLength = cart.length;
    
    cart = cart.filter(item => item.id !== id);
    
    if (cart.length < initialLength) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        loadCart(); // Tải lại giỏ hàng
    }
}
window.removeItem = removeItem;


// === HÀM THANH TOÁN (CHECKOUT) ĐÃ SỬA LỖI ==================================
function checkout() {
    const cartKey = getCurrentUserKey('cart');
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm.");
        return;
    }
    
    if (!currentUser || !currentUser.username) {
        alert("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        window.location.href = 'dangnhap.html';
        return;
    }

    // 1. Lấy tất cả đơn hàng hiện tại
    let orders = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) || [];
    
    // Xác định Order ID mới
    const nextOrderId = orders.length > 0 
        ? Math.max(...orders.map(o => o.id)) + 1 
        : 1000;
    
    const currentDate = new Date().toISOString().substring(0, 10);

    // Lấy tổng tiền (loại bỏ ký tự phân cách)
    const rawTotalPriceText = document.getElementById("totalPrice").textContent;
    // Loại bỏ mọi ký tự không phải số
    const totalPriceNumber = rawTotalPriceText.replace(/[^0-9]/g, ''); 

    // 2. Chuyển giỏ hàng thành một đơn hàng mới ở trạng thái "Chờ xác nhận"
    const newOrder = {
        id: nextOrderId,
        username: currentUser.username, // 🔥 ĐÃ THÊM: Lưu tên người dùng mua hàng
        items: cart.map(item => ({
            id: item.id, 
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        totalPrice: totalPriceNumber,
        status: 'Chờ xác nhận',/*ban đầu: "Chờ xác nhận"*/
        date: currentDate
    };

    orders.push(newOrder);

    // 3. Lưu lại danh sách đơn hàng đã cập nhật
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));

    // 4. Xóa giỏ hàng sau khi thanh toán
    localStorage.removeItem(cartKey);

    alert("🎉 Thanh toán thành công! Đơn hàng của bạn đang ở trạng thái 'Chờ xác nhận'.");
    
    // Tải lại trang Giỏ hàng để hiển thị Giỏ hàng trống
    window.location.reload(); 
}
window.checkout = checkout;