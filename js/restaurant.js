// SHARED CART - Works across ALL pages
let cart = JSON.parse(localStorage.getItem('munchbite-cart')) || [];

// Spice Haven Menu (10 dishes)
const restaurantMenu = [
    { id: 101, name: 'Butter Chicken', price: 299, img: './images/pasta.jpg', restaurant: 'Spice Haven' },
    { id: 102, name: 'Chicken Biryani', price: 279, img: './images/main-b.jpg', restaurant: 'Spice Haven' },
    { id: 103, name: 'Paneer Tikka', price: 229, img: './images/sandwich.jpg', restaurant: 'Spice Haven' },
    { id: 104, name: 'Dal Makhani', price: 199, img: './images/image7.jpg', restaurant: 'Spice Haven' },
    { id: 105, name: 'Naan Basket', price: 149, img: './images/pizza.jpg', restaurant: 'Spice Haven' },
    { id: 106, name: 'Rogan Josh', price: 349, img: './images/buger.jpg', restaurant: 'Spice Haven' },
    { id: 107, name: 'Aloo Gobi', price: 179, img: './images/image5.jpg', restaurant: 'Spice Haven' },
    { id: 108, name: 'Garlic Naan', price: 79, img: './images/bt2.jpg', restaurant: 'Spice Haven' },
    { id: 109, name: 'Lassi', price: 99, img: './images/sushi.png', restaurant: 'Spice Haven' },
    { id: 110, name: 'Gulab Jamun', price: 129, img: './images/image4.avif', restaurant: 'Spice Haven' }
];

document.addEventListener('DOMContentLoaded', function() {
    renderRestaurantMenu();
    updateCartUI();
    setupEventListeners();
});

function renderRestaurantMenu() {
    const container = document.getElementById('restaurantMenuGrid');
    container.innerHTML = restaurantMenu.map(item => createMenuCard(item)).join('');
}

function createMenuCard(item) {
    return `
        <div class="food-card" onclick="addToCart(${item.id})">
            <div class="card-image" style="background-image: url('${item.img}'); background-size: cover;">
                <div class="image-overlay">
                    <i class="fas fa-cart-shopping"></i> ADD
                </div>
            </div>
            <h3>${item.name}</h3>
            <div class="card-rating">⭐ 4.8</div>
            <div class="restaurant-name">${item.restaurant}</div>
            <div class="price">₹${item.price}</div>
            <button class="btn btn-primary full-width">ADD ₹${item.price}</button>
        </div>
    `;
}

// SHARED CART FUNCTIONS (same as main page)
function addToCart(itemId) {
    const item = restaurantMenu.find(p => p.id === itemId) || topPicks.find(p => p.id === itemId);
    if (!item) return;

    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('munchbite-cart', JSON.stringify(cart));
    updateCartUI();
    showSuccessMessage('Added to cart!');
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Copy ALL cart/auth functions from your main script.js
// (showCart, renderCartModal, changeQuantity, placeOrder, etc.)
