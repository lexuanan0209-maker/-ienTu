// hoso.js - GỌN GÀNG, GIỮ NGUYÊN TÍNH NĂNG

const CURRENT_USER_KEY = 'currentUser';
const USERS_STORAGE_KEY = 'users';

// --- Load dữ liệu profile ---
function loadProfileData() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return window.location.href = typeof LOGIN_PAGE !== 'undefined' ? LOGIN_PAGE : 'dangnhap.html';

    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    if (userNameInput) userNameInput.value = currentUser.displayName || currentUser.username || '';
    if (userPhoneInput) userPhoneInput.value = currentUser.phone || '';

    const currentAvatarEl = document.getElementById('currentAvatar');
    if (currentAvatarEl && currentUser.avatarUrl) currentAvatarEl.src = currentUser.avatarUrl;
}
window.loadProfileData = loadProfileData;

// --- Submit form profile ---
function handleProfileSubmit(e) {
    e.preventDefault();
    const newName = document.getElementById('userName').value.trim();
    const newPhone = document.getElementById('userPhone').value.trim();
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return alert('Lỗi: Không tìm thấy thông tin người dùng.');

    currentUser.displayName = newName;
    currentUser.phone = newPhone;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    const allUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const idx = allUsers.findIndex(u => u.username === currentUser.username);
    if (idx !== -1) {
        allUsers[idx].displayName = newName;
        allUsers[idx].phone = newPhone;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    }
    alert('Cập nhật hồ sơ thành công!');
    window.location.href = 'GDND.html';
}
window.handleProfileSubmit = handleProfileSubmit;

// --- Chọn ảnh đại diện ---
function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64Img = evt.target.result;
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || {};
        currentUser.avatarUrl = base64Img;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

        const currentAvatarEl = document.getElementById('currentAvatar');
        if (currentAvatarEl) currentAvatarEl.src = base64Img;

        const allUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
        const idx = allUsers.findIndex(u => u.username === currentUser.username);
        if (idx !== -1) {
            allUsers[idx].avatarUrl = base64Img;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
        }
    };
    reader.readAsDataURL(file);
}
window.handleAvatarChange = handleAvatarChange;

// --- DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    const form = document.getElementById('profileEditForm');
    if (form) form.addEventListener('submit', handleProfileSubmit);

    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarChange);
});
