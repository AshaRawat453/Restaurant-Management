document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Set up menu categories
    setupMenuCategories();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up forms
    setupForms();
    
    // Set up payment method toggle
    setupPaymentToggle();
    
    // Initialize cart from localStorage
    initCart();
}

/**
 * Set up navigation between sections
 */
function setupNavigation() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            navigateTo(targetId);
        });
    });
}

/**
 * Navigate to a specific section
 * @param {string} targetId - The ID of the target section
 */
function navigateTo(targetId) {
    // Remove active class from all sections and nav links
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to target section
    document.querySelector(targetId).classList.add('active');
    
    // Add active class to corresponding nav link
    const navLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
    
    // Scroll to top of the section
    window.scrollTo(0, 0);
}

/**
 * Set up menu category switching
 */
function setupMenuCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and menu items
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.menu-items').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding menu items
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            document.getElementById(category).classList.add('active');
        });
    });
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}

/**
 * Set up form validation and submission
 */
function setupForms() {
    // Reservation form
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateReservationForm()) {
                // Process form submission
                const formData = new FormData(reservationForm);
                const reservationData = {};
                
                for (let [key, value] of formData.entries()) {
                    reservationData[key] = value;
                }
                
                // Save reservation to localStorage
                saveReservation(reservationData);
                
                // Show confirmation
                showReservationConfirmation(reservationData);
                
                // Reset form
                reservationForm.reset();
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateContactForm()) {
                // Process form submission
                const formData = new FormData(contactForm);
                const contactData = {};
                
                for (let [key, value] of formData.entries()) {
                    contactData[key] = value;
                }
                
                // Show confirmation
                document.getElementById('contact-form').classList.add('hidden');
                document.getElementById('contact-confirmation').classList.remove('hidden');
                
                // Reset form
                contactForm.reset();
            }
        });
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateCheckoutForm()) {
                // Process order
                processOrder();
            }
        });
    }
    
    // Set current date as minimum date for reservations
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        dateInput.setAttribute('min', formattedDate);
    }
}

/**
 * Validate reservation form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateReservationForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(elem => {
        elem.textContent = '';
    });
    
    // Validate name
    const name = document.getElementById('name').value.trim();
    if (name === '') {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    if (email === '') {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone').value.trim();
    if (phone === '') {
        document.getElementById('phone-error').textContent = 'Phone number is required';
        isValid = false;
    } else if (!isValidPhone(phone)) {
        document.getElementById('phone-error').textContent = 'Please enter a valid 10-digit phone number';
        isValid = false;
    }
    
    // Validate date
    const date = document.getElementById('date').value;
    if (date === '') {
        document.getElementById('date-error').textContent = 'Date is required';
        isValid = false;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            document.getElementById('date-error').textContent = 'Date cannot be in the past';
            isValid = false;
        }
    }
    
    // Validate time
    const time = document.getElementById('time').value;
    if (time === '') {
        document.getElementById('time-error').textContent = 'Time is required';
        isValid = false;
    }
    
    // Validate guests
    const guests = document.getElementById('guests').value;
    if (guests === '') {
        document.getElementById('guests-error').textContent = 'Number of guests is required';
        isValid = false;
    }
    
    // Validate terms
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        document.getElementById('terms-error').textContent = 'You must agree to the cancellation policy';
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate contact form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateContactForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(elem => {
        elem.textContent = '';
    });
    
    // Validate name
    const name = document.getElementById('contact-name').value.trim();
    if (name === '') {
        document.getElementById('contact-name-error').textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('contact-email').value.trim();
    if (email === '') {
        document.getElementById('contact-email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('contact-email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate subject
    const subject = document.getElementById('subject').value.trim();
    if (subject === '') {
        document.getElementById('subject-error').textContent = 'Subject is required';
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message').value.trim();
    if (message === '') {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate checkout form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateCheckoutForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(elem => {
        elem.textContent = '';
    });
    
    // Validate name
    const name = document.getElementById('checkout-name').value.trim();
    if (name === '') {
        document.getElementById('checkout-name-error').textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('checkout-phone').value.trim();
    if (phone === '') {
        document.getElementById('checkout-phone-error').textContent = 'Phone number is required';
        isValid = false;
    } else if (!isValidPhone(phone)) {
        document.getElementById('checkout-phone-error').textContent = 'Please enter a valid 10-digit phone number';
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('checkout-email').value.trim();
    if (email === '') {
        document.getElementById('checkout-email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('checkout-email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate address
    const address = document.getElementById('checkout-address').value.trim();
    if (address === '') {
        document.getElementById('checkout-address-error').textContent = 'Delivery address is required';
        isValid = false;
    }
    
    // Validate delivery time
    const deliveryTime = document.getElementById('delivery-time').value;
    if (deliveryTime === '') {
        document.getElementById('delivery-time-error').textContent = 'Delivery time is required';
        isValid = false;
    }
    
    // Validate card details if payment method is card
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    if (paymentMethod === 'card') {
        // Validate card number
        const cardNumber = document.getElementById('card-number').value.trim();
        if (cardNumber === '') {
            document.getElementById('card-number-error').textContent = 'Card number is required';
            isValid = false;
        } else if (!isValidCardNumber(cardNumber)) {
            document.getElementById('card-number-error').textContent = 'Please enter a valid card number';
            isValid = false;
        }
        
        // Validate expiry date
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        if (cardExpiry === '') {
            document.getElementById('card-expiry-error').textContent = 'Expiry date is required';
            isValid = false;
        } else if (!isValidExpiryDate(cardExpiry)) {
            document.getElementById('card-expiry-error').textContent = 'Please enter a valid expiry date (MM/YY)';
            isValid = false;
        }
        
        // Validate CVV
        const cardCVV = document.getElementById('card-cvv').value.trim();
        if (cardCVV === '') {
            document.getElementById('card-cvv-error').textContent = 'CVV is required';
            isValid = false;
        } else if (!isValidCVV(cardCVV)) {
            document.getElementById('card-cvv-error').textContent = 'Please enter a valid CVV (3-4 digits)';
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if phone number is valid
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone is valid, false otherwise
 */
function isValidPhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

/**
 * Check if card number is valid
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} - True if card number is valid, false otherwise
 */
function isValidCardNumber(cardNumber) {
    // Remove spaces and dashes
    const cleanedCardNumber = cardNumber.replace(/[\s-]/g, '');
    // Check if it contains only digits and has proper length
    return /^\d{13,19}$/.test(cleanedCardNumber);
}

/**
 * Check if expiry date is valid
 * @param {string} expiryDate - Expiry date to validate
 * @returns {boolean} - True if expiry date is valid, false otherwise
 */
function isValidExpiryDate(expiryDate) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    
    if (!expiryRegex.test(expiryDate)) {
        return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    // Create two-digit year
    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);
    
    // Check if the card is expired
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return false;
    }
    
    return true;
}

/**
 * Check if CVV is valid
 * @param {string} cvv - CVV to validate
 * @returns {boolean} - True if CVV is valid, false otherwise
 */
function isValidCVV(cvv) {
    return /^[0-9]{3,4}$/.test(cvv);
}

/**
 * Save reservation to localStorage
 * @param {Object} reservationData - Reservation data to save
 */
function saveReservation(reservationData) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push({
        id: Date.now(),
        ...reservationData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

/**
 * Show reservation confirmation message
 * @param {Object} reservationData - Reservation data to display
 */
function showReservationConfirmation(reservationData) {
    document.getElementById('reservation-form').classList.add('hidden');
    document.getElementById('reservation-confirmation').classList.remove('hidden');
    
    // Create reservation details text
    const reservationDate = new Date(reservationData.date + 'T' + reservationData.time);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    
    const formattedDate = reservationDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = reservationDate.toLocaleTimeString('en-US', timeOptions);
    
    const detailsText = `We look forward to serving you on ${formattedDate} at ${formattedTime} for ${reservationData.guests} ${reservationData.guests === '1' ? 'person' : 'people'}.`;
    
    document.getElementById('reservation-details').textContent = detailsText;
}

/**
 * Reset reservation form
 */
function resetReservationForm() {
    document.getElementById('reservation-confirmation').classList.add('hidden');
    document.getElementById('reservation-form').classList.remove('hidden');
}

/**
 * Reset contact form
 */
function resetContactForm() {
    document.getElementById('contact-confirmation').classList.add('hidden');
    document.getElementById('contact-form').classList.remove('hidden');
}

/**
 * Set up payment method toggle
 */
function setupPaymentToggle() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardDetails = document.getElementById('card-details');
    
    if (paymentMethods.length > 0 && cardDetails) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardDetails.classList.remove('hidden');
                } else {
                    cardDetails.classList.add('hidden');
                }
            });
        });
    }
}

/**
 * Cart functionality
 */
let cart = [];

/**
 * Initialize cart from localStorage
 */
function initCart() {
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart UI
    updateCartUI();
}

/**
 * Add item to cart
 * @param {Object} item - Item to add to cart
 */
function addToCart(item) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
        // Item already exists, increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Item doesn't exist, add it to cart
        cart.push(item);
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Show notification
    showCartNotification(item.name);
}

/**
 * Update item quantity in cart
 * @param {string} itemId - ID of item to update
 * @param {number} amount - Amount to change quantity by
 */
function updateQuantity(itemId, amount) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Update quantity
        cart[itemIndex].quantity += amount;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart UI
        updateCartUI();
    }
}

/**
 * Remove item from cart
 * @param {string} itemId - ID of item to remove
 */
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Remove item
        cart.splice(itemIndex, 1);
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart UI
        updateCartUI();
    }
}

/**
 * Clear all items from cart
 */
function clearCart() {
    // Clear cart array
    cart = [];
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Hide checkout form if visible
    hideCheckoutForm();
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update cart UI elements
 */
function updateCartUI() {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalCount;
    
    // Update cart items container
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        // Cart is empty
        cartItemsContainer.classList.add('hidden');
        cartSummary.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }
    
    // Cart has items
    emptyCart.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    cartSummary.classList.remove('hidden');
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal}</div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update cart summary
    updateCartSummary();
    
    // Update checkout summary if checkout form is visible
    if (!document.getElementById('checkout-form-container').classList.contains('hidden')) {
        updateCheckoutSummary();
    }
}

/**
 * Update cart summary
 */
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

/**
 * Show cart notification
 * @param {string} itemName - Name of item added to cart
 */
function showCartNotification(itemName) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
        
        // Add styles for notification
        const style = document.createElement('style');
        style.textContent = `
            .cart-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                z-index: 1100;
                transition: transform 0.3s ease, opacity 0.3s ease;
                transform: translateX(100%);
                opacity: 0;
            }
            
            .cart-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set notification text and show it
    notification.textContent = `${itemName} added to cart`;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Show checkout form
 */
function showCheckoutForm() {
    document.getElementById('cart-container').classList.add('hidden');
    document.getElementById('checkout-form-container').classList.remove('hidden');
    
    // Update checkout summary
    updateCheckoutSummary();
}

/**
 * Hide checkout form
 */
function hideCheckoutForm() {
    document.getElementById('checkout-form-container').classList.add('hidden');
    document.getElementById('cart-container').classList.remove('hidden');
}

/**
 * Update checkout summary
 */
function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';
    
    // Add checkout items
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-name">${item.quantity} × ${item.name}</div>
            <div class="checkout-item-price">$${itemTotal}</div>
        `;
        
        checkoutItems.appendChild(checkoutItem);
    });
    
    // Update checkout summary
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const deliveryFee = 5.00;
    const total = subtotal + tax + deliveryFee;
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

/**
 * Process order
 */
function processOrder() {
    // Get form data
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const orderData = {};
    
    for (let [key, value] of formData.entries()) {
        orderData[key] = value;
    }
    
    // Add cart items to order data
    orderData.items = cart;
    orderData.subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    orderData.tax = orderData.subtotal * 0.1;
    orderData.deliveryFee = 5.00;
    orderData.total = orderData.subtotal + orderData.tax + orderData.deliveryFee;
    orderData.orderNumber = generateOrderNumber();
    orderData.orderDate = new Date().toISOString();
    
    // Save order to localStorage
    saveOrder(orderData);
    
    // Show order confirmation
    showOrderConfirmation(orderData);
    
    // Clear cart
    clearCart();
    
    // Reset form
    form.reset();
}

/**
 * Generate a random order number
 * @returns {string} - Random order number
 */
function generateOrderNumber() {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
}

/**
 * Save order to localStorage
 * @param {Object} orderData - Order data to save
 */
function saveOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Show order confirmation
 * @param {Object} orderData - Order data to display
 */
function showOrderConfirmation(orderData) {
    document.getElementById('checkout-form').classList.add('hidden');
    document.getElementById('order-confirmation').classList.remove('hidden');
    
    // Set order number
    document.querySelector('#order-number span').textContent = orderData.orderNumber;
    
    // Create order details text
    const deliveryTime = orderData['delivery-time'] === 'asap' ? 
        'as soon as possible' : 
        `in ${orderData['delivery-time'].replace('mins', ' minutes').replace('hour', ' hour').replace('hours', ' hours')}`;
    
    const detailsText = `Your order will be delivered to ${orderData['checkout-address']} ${deliveryTime}.`;
    
    document.getElementById('order-details').textContent = detailsText;
}