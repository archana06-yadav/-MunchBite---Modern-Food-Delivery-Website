// Global State
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('munchmint-cart')) || [];
let currentAuthRole = 'user';




let currentHeroImage = 0;

// Data
const topPicks = [
    { id: 1, name: 'Pasta', price: 249, restaurant: 'Spice Haven', rating: 4.8,  img: "./images/pasta.jpg" },
    { id: 2, name: 'Margherita Pizza', price: 299, restaurant: 'Pizza Palace', rating: 4.7, img: "./images/pizza.jpg" },
    { id: 3, name: 'sushi', price: 279, restaurant: 'Taj Mahal', rating: 4.9, img: "./images/main-b.jpg" },
    { id: 4, name: 'Veggie Burger', price: 199, restaurant: 'Burger Bonanza', rating: 4.6, img: "./images/buger.jpg" },
    { id: 5, name: 'Veg sandwitch', price: 229, restaurant: 'Spice Haven', rating: 4.8, img: "./images/sandwich.jpg" },
    { id: 6, name: 'Masala Dosa', price: 159, restaurant: 'Dosa Delight', rating: 4.8, img: "./images/image7.jpg" }
];


// FIXED RESTAURANTS DATA (Professional Names)
const restaurants = [
    {
        id: 1,
        name: 'Spice Haven',
        rating: 4.8,
        time: '25-35 min',
        price: '₹200 - ₹400',
        img: "./images/image9.jpg",        
        cuisines: 'North Indian, Mughlai'
    },
    {
        id: 2,
        name: 'Pizza Palace',
        rating: 4.7,
        time: '20-30 min',
        price: '₹300 - ₹500',
        img: "./images/image4.avif",        
        cuisines: 'Italian, Pizza'
    },
    {
        id: 3,
        name: 'Burger Bonanza',
        rating: 4.6,
        time: '15-25 min',
        price: '₹150 - ₹300',
        img: "./images/image5.jpg",       
        cuisines: 'Fast Food, Burgers'
    },
    {
        id: 4,
        name: 'Sweet Delight',
        rating: 4.8,
        time: '20-30 min',
        price: '₹100 - ₹250',
        img: "./images/bt2.jpg",      
        cuisines: 'Desserts, Sweets'
    },
    {
        id: 5,
        name: 'South Spice',
        rating: 4.9,
        time: '25-35 min',
        price: '₹200 - ₹400',
        img: "./images/sushi.png",       
        cuisines: 'South Indian, Chettinad'
    }
];




// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startHeroAnimation();
    updateCartUI();
});

// Initialize
function initializeApp() {
    renderTopPicks();
    renderRestaurants();
    animateStats();
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.tab-btn.active').classList.remove('active');
            this.classList.add('active');
            currentAuthRole = this.dataset.role;
        });
    });
}

// Hero Animation

function startHeroAnimation() {
    // FALLBACK IMAGES - NONE WILL BE BLANK
    const fallbackImages = [
           './images/gallary_1.jpg',
    './images/gallary_6.jpg',
    './images/ice_cream.jpg',
    './images/Spanchi.jpg'
    ];
    
    const titles = ['Discover Delicious Food', 'Food Delivered Fast', '5000+ Restaurants', 'Satisfy Your Cravings'];
    const subtitles = ['Order from 5000+ restaurants near you', 'Lightning fast delivery at your doorstep', 'From pizza to biryani - we have it all', 'Order now and get 50% off first order!'];
    
    let index = 0;
    
    function safeLoadImage(imgIndex) {
        const img = new Image();
        img.src = fallbackImages[imgIndex];
        img.onload = () => {
            document.getElementById('hero-image').style.backgroundImage = `url(${fallbackImages[imgIndex]})`;
        };
        img.onerror = () => {
            // Use next image if this one fails
            safeLoadImage((imgIndex + 1) % 4);
        };
    }
    
    function updateHero() {
        document.getElementById('hero-title').textContent = titles[index];
        document.getElementById('hero-subtitle').textContent = subtitles[index];
        safeLoadImage(index);
        index = (index + 1) % 4;
    }
    
    // START IMMEDIATELY
    updateHero();
    setInterval(updateHero, 3000);
}


// Render Functions
function renderTopPicks() {
    const container = document.getElementById('topPicksGrid');
    container.innerHTML = topPicks.map(item => createFoodCard(item)).join('');
}

function renderRestaurants() {
    const container = document.getElementById('restaurantsGrid');
    container.innerHTML = restaurants.map(item => createRestaurantCard(item)).join('');
}

function createFoodCard(item) {
    return `
        <div class="food-card" onclick="addToCart(${item.id})" style="cursor: pointer;">
            <div class="card-image" style="background-image: url('${item.img}'); background-size: cover; background-position: center;">
                <div class="image-overlay">
                    <i class="fas fa-cart-shopping"></i><br>ADD TO CART
                </div>
            </div>
            <h3 class="card-title">${item.name}</h3>
            <div class="card-rating">⭐ ${item.rating}</div>
            <div class="restaurant-name">${item.restaurant}</div>
            <div class="price">₹${item.price}</div>
            <button class="btn btn-primary full-width" onclick="event.stopPropagation(); addToCart(${item.id})">
                ADD ₹${item.price}
            </button>
        </div>
    `;
}

// FIXED createRestaurantCard FUNCTION
function createRestaurantCard(restaurant) {
    return `
        <div class="restaurant-card" onclick="window.location.href='restaurant${restaurant.id}.html'">
            <div class="restaurant-image" style="background-image: url('${restaurant.img}'); background-size: cover; background-position: center;">
                <div class="restaurant-overlay">
                    <i class="fas fa-arrow-right"></i> VIEW MENU
                </div>
            </div>
            <div class="restaurant-card-content">
                <h3 class="card-title">${restaurant.name}</h3>
                <div class="card-rating">⭐ ${restaurant.rating} (${restaurant.time})</div>
                <div class="price">${restaurant.price}</div>
                <div class="cuisines">${restaurant.cuisines}</div>
            </div>
        </div>
    `;
}


// Cart Functions
function addToCart(itemId) {
    // ✅ WORKS ON BOTH MAIN PAGE & RESTAURANT PAGES
    let item = topPicks.find(p => p.id === itemId);
    
    // ✅ Check restaurantMenu if on restaurant page
    if (!item && typeof restaurantMenu !== 'undefined') {
        item = restaurantMenu.find(p => p.id === itemId);
    }
    
    if (!item) {
        console.log('Item not found ID:', itemId);
        return;
    }

    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('munchmint-cart', JSON.stringify(cart));
    updateCartUI();
    showSuccessMessage('Added to cart!');
}


// IMPROVED updateCartUI - Works on ALL pages
function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count || 0;
    }
    console.log('Cart updated:', count, 'items'); // DEBUG
}


function showCart() {
    renderCartModal();
    document.getElementById('cartModal').style.display = 'flex';
}

function renderCartModal() {
    const container = document.getElementById('cartItemsContainer');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray);">Your cart is empty</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--light-gray);">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(0)}</p>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <button onclick="changeQuantity(${item.id}, -1)" style="width: 35px; height: 35px; border: 1px solid var(--light-gray); border-radius: 50%;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" style="width: 35px; height: 35px; border: 1px solid var(--light-gray); border-radius: 50%;">+</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('cartTotal').textContent = `₹${total.toFixed(0)}`;
}

function changeQuantity(id, delta) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
        localStorage.setItem('munchmint-cart', JSON.stringify(cart));
        updateCartUI();
        renderCartModal();
    }
}

function placeOrder() {
    if (cart.length === 0) return;
    alert('Order placed successfully! 🎉\nEstimated delivery: 25-35 minutes');
    cart = [];
    localStorage.setItem('munchmint-cart', JSON.stringify(cart));
    closeCart();
    updateCartUI();
}

// Auth Functions
function showAuthModal(type) {
    document.getElementById('modalTitle').textContent = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('authModal').style.display = 'flex';
}

function handleAuth(e) {
    e.preventDefault();
    
    const input = document.getElementById('authInput').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // 🔥 ANY EMAIL + ANY PASSWORD = INSTANT SUCCESS!
    if (input && password) {
        currentUser = { 
            role: currentAuthRole || 'user', 
            email: input 
        };
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('authForm').reset();
        
        // GREEN SUCCESS TOAST
        const toast = document.createElement('div');
        toast.textContent = `✅ Welcome ${input.split('@')[0]}!`;
        toast.style.cssText = `
            position: fixed; top: 100px; right: 20px; 
            background: #14B8A6; color: white; padding: 1rem 2rem; 
            border-radius: 10px; z-index: 9999; font-family: Poppins, sans-serif;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        
        updateAuthUI();
    } else {
        alert('Enter email and password!');
    }
}


// ✅ HELPER FUNCTION (Add after handleAuth)
function getRoleName(role) {
    const names = {
        user: 'Customer',
        owner: 'Restaurant Owner', 
        'new-restaurant': 'New Restaurant Owner'
    };
    return names[role] || role.charAt(0).toUpperCase() + role.slice(1);
}

function showSuccessMessage(msg) {
    showToast(msg, 'success');
}

function showErrorMessage(msg) {
    showToast(msg, 'error');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; top: 100px; right: 20px; 
        background: ${type === 'error' ? '#ef4444' : 'var(--mint-primary, #14B8A6)'};
        color: white; padding: 1rem 2rem; border-radius: 10px; 
        z-index: 9999; font-family: 'Poppins', sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), type === 'error' ? 5000 : 4000);
}


function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (currentUser) {
        authSection.innerHTML = `
            <span style="color: var(--mint-primary); font-weight: 500;">
                Hi, ${currentUser.email.split('@')[0]} 👋
            </span>
            <button class="btn btn-outline" onclick="logout()">Logout</button>
        `;
    } else {
        authSection.innerHTML = `
            <button class="btn btn-outline" onclick="showAuthModal('login')">Login</button>
            <button class="btn btn-primary" onclick="showAuthModal('signup')">Sign Up</button>
        `;
    }
}

function logout() {
    currentUser = null;
    updateAuthUI();
}

// Modal Controls
function closeModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('authForm').reset();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}




// Navigation
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

function openRestaurantPage(id) {
    // For now, show alert. You can create separate HTML pages later
    alert(`Opening ${restaurants.find(r => r.id === id).name} page...\n(Create restaurant-${id}.html for full page)`);
}

function animateStats() {
    // Trigger animations on scroll
    window.addEventListener('scroll', () => {
        if (document.querySelector('.stats-section').getBoundingClientRect().top < window.innerHeight) {
            document.querySelector('.left-slide').style.animationPlayState = 'running';
            document.querySelector('.right-slide').style.animationPlayState = 'running';
        }
    });
}

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
