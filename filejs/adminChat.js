let currentChattingUserId = null;

// Lấy tên hiển thị User từ localStorage
const getUserDisplayName = (userId) => {
    const user = (JSON.parse(localStorage.getItem('users')) || []).find(u => u.username === userId);
    return user ? (user.displayName || userId) : userId;
};
window.getUserDisplayName = getUserDisplayName;

// Khởi tạo chat Admin
const initializeAdminChat = () => {
    loadChatList();
    setInterval(loadChatList, 5000);
    window.addEventListener('newMessage', loadChatList);
};
window.initializeAdminChat = initializeAdminChat;

// Tải danh sách khách hàng Sidebar
const loadChatList = () => {
    const list = document.getElementById('customerChatList');
    if (!list) return;
    const scrollTop = list.scrollTop;
    list.innerHTML = '';

    const userIds = getAllChattingUsers(); // từ chat.js
    if (!userIds.length) return list.innerHTML = '<p style="padding:10px;color:#666;">Chưa có khách hàng nào gửi tin nhắn.</p>';

    userIds.forEach(userId => {
        const history = getChatHistory(userId);
        const lastMessage = history[history.length - 1] || null;
        const isNew = hasNewMessage(userId);
        const nameToDisplay = getUserDisplayName(userId);

        const div = document.createElement('div');
        div.className = 'user-chat-item';
        if (userId === currentChattingUserId) div.classList.add('active');
        div.dataset.userId = userId;

        div.innerHTML = `
            <strong>👤 ${nameToDisplay}</strong> 
            ${isNew && userId !== currentChattingUserId ? '<span class="new-message-indicator">MỚI</span>' : ''}
            <p style="color:#666;font-size:0.85em;margin:5px 0 0;">
                ${lastMessage ? (lastMessage.sender==='user'?'Khách: ':'Bạn: ') + lastMessage.text.slice(0,30) + (lastMessage.text.length>30?'...':'') : 'Chưa có tin nhắn.'}
            </p>
        `;
        div.onclick = () => openAdminChatWindow(userId);
        list.appendChild(div);
    });

    list.scrollTop = scrollTop;
    if (!currentChattingUserId && userIds.length) openAdminChatWindow(userIds[0]);
    else if (currentChattingUserId) loadChat('admin', currentChattingUserId);
};
window.loadChatList = loadChatList;

// Mở cửa sổ chat với khách hàng
const openAdminChatWindow = (userId) => {
    currentChattingUserId = userId;

    document.querySelectorAll('.user-chat-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`[data-user-id="${userId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        const indicator = activeItem.querySelector('.new-message-indicator');
        if (indicator) indicator.remove();
    }

    document.getElementById('chatHeader').textContent = `Đang chat với: 👤 ${getUserDisplayName(userId)}`;
    document.getElementById('messageInput').disabled = false;
    document.querySelector('.message-form button').disabled = false;

    loadChat('admin', userId); // từ chat.js
};
window.openAdminChatWindow = openAdminChatWindow;

// Gửi tin nhắn Admin
const handleAdminSend = (event) => {
    if (currentChattingUserId) sendMessage(event, 'admin', currentChattingUserId); // từ chat.js
};
window.handleAdminSend = handleAdminSend;
