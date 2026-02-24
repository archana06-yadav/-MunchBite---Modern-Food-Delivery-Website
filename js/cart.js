// SINGLE CART SYSTEM - WORKS FOR BOTH PAGES
let cart = JSON.parse(localStorage.getItem('munchmint-cart')) || [];

// Update navbar count (BOTH pages)
function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = count || 0;
}

// Add to cart (index.html)
function addToCart(id) {
    const item = topPicks.find(p => p.id === id);
    if (!item) return;
    
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('munchmint-cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${item.name} added to cart!`);
}

// Cart page functions
function renderCart() {
    const container = document.getElementById('cartItemsList');
    const emptyMsg = document.getElementById('emptyCartMessage');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyMsg.style.display = 'block';
        if (placeOrderBtn) placeOrderBtn.disabled = true;
        updateSummary();
        return;
    }
    
    container.style.display = 'block';
    emptyMsg.style.display = 'none';
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end;">
                <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                <button class="remove-item" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
    
    updateSummary();
    if (placeOrderBtn) placeOrderBtn.disabled = false;
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        if (item.quantity === 0) {
            cart = cart.filter(c => c.id !== id);
        }
        localStorage.setItem('munchmint-cart', JSON.stringify(cart));
        renderCart();
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('munchmint-cart', JSON.stringify(cart));
    renderCart();
    updateCartUI();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const delivery = 50;
    const grandTotal = subtotal + tax + delivery;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('grandTotal').textContent = `₹${grandTotal.toLocaleString()}`;
}

function applyCoupon() {
    const code = document.getElementById('couponInput').value;
    const messageEl = document.getElementById('couponMessage');
    
    if (code.toLowerCase() === 'mint10') {
        messageEl.textContent = '₹50 discount applied! 🎉';
        messageEl.style.color = 'var(--mint-primary)';
    } else {
        messageEl.textContent = 'Invalid coupon code';
        messageEl.style.color = '#ef4444';
    }
    setTimeout(() => messageEl.textContent = '', 3000);
}

function placeOrder() {
    if (cart.length === 0) return;
    alert(`Order placed successfully!\nTotal: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}`);
    cart = [];
    localStorage.setItem('munchmint-cart', JSON.stringify(cart));
    renderCart();
    updateCartUI();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: var(--mint-primary);
        color: white; padding: 1rem 2rem; border-radius: 10px; z-index: 9999;
        box-shadow: 0 10px 30px rgba(20,184,166,0.3); transform: translateX(400px);
        transition: all 0.3s ease; font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    if (document.getElementById('cartItemsList')) {
        renderCart();
    }
    
    // Cross-tab sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'munchmint-cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartUI();
            if (document.getElementById('cartItemsList')) renderCart();
        }
    });
});
