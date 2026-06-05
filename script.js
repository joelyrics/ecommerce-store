// =============================================
//  EMS — E-Millenial Store  |  script.js
// =============================================

// --- State ---
var cart = [];       // Array of { product, quantity }
var user = {};       // { name, email, phone }
var mouseX = 0;      // Mouse X position
var mouseY = 0;      // Mouse Y position
var currentFilter = 'all'; // Current active filter

// =============================================
//  CART TOGGLE (Add / Remove from landing page)
// =============================================
function toggleCart(productId) {
  var inCart = isInCart(productId);
  if (inCart) {
    removeFromCart(productId);
  } else {
    addToCart(productId);
  }

  updateCartButton();
  updateProductButton(productId);
}

function addToCart(productId) {
  var product = getProduct(productId);
  if (!product) return;
  cart.push({ product: product, quantity: 1 });
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.product.id !== productId;
  });
  // Also update card border
  var card = document.getElementById('card-' + productId);
  if (card) card.classList.remove('in-cart');
}

function isInCart(productId) {
  return cart.some(function (item) {
    return item.product.id === productId;
  });
}

function getProduct(productId) {
  return products.find(function (p) {
    return p.id === productId;
  });
}

// =============================================
//  FILTER PRODUCTS
// =============================================
function filterProducts(category) {
  currentFilter = category;
  
  // Update active button
  var buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(function (btn) {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter products
  var cards = document.querySelectorAll('.product-card');
  cards.forEach(function (card) {
    var productId = card.id.replace('card-', '');
    var product = getProduct(productId);
    
    if (category === 'all' || (product && product.category === category)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}
  document.body.style.overflow = '';


function handleOverlayClick(event) {
  if (event.target === document.getElementById('cartOverlay')) {
    closeCart();
  }
}

document.getElementById('cartBtn').addEventListener('click', openCart);

// =============================================
//  POINTER FOLLOWER
// =============================================
document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  var follower = document.getElementById('pointerFollower');
  if (follower) {
    follower.style.left = mouseX + 'px';
    follower.style.top = mouseY + 'px';
  }
});

// =============================================
//  RENDER CART TABLE
// =============================================
function renderCartTable() {
  var tbody = document.getElementById('cartTableBody');
  var emptyMsg = document.getElementById('emptyCartMsg');
  tbody.innerHTML = '';

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    updateTotal();
    return;
  }

  emptyMsg.style.display = 'none';

  cart.forEach(function (item, index) {
    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + (index + 1) + '</td>' +
      '<td>' + item.product.name + '</td>' +
      '<td>₵' + formatPrice(item.product.price * item.quantity) + '</td>' +
      '<td class="qty-cell">' +
        '<button class="qty-btn" onclick="decrementQty(\'' + item.product.id + '\')">−</button>' +
        '<span class="qty-num">' + item.quantity + '</span>' +
        '<button class="qty-btn" onclick="incrementQty(\'' + item.product.id + '\')">+</button>' +
      '</td>' +
      '<td><button class="remove-item-btn" onclick="removeItemFromCart(\'' + item.product.id + '\')">Remove</button></td>';
    tbody.appendChild(row);
  });

  updateTotal();
}

// =============================================
//  QUANTITY CONTROLS
// =============================================
function incrementQty(productId) {
  var item = getCartItem(productId);
  if (item) {
    item.quantity += 1;
    renderCartTable();
  }
}

function decrementQty(productId) {
  var item = getCartItem(productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeItemFromCart(productId);
      return;
    }
    renderCartTable();
  }
}

function removeItemFromCart(productId) {
  removeFromCart(productId);
  updateCartButton();
  updateProductButton(productId);
  renderCartTable();
}

function getCartItem(productId) {
  return cart.find(function (item) {
    return item.product.id === productId;
  });
}

// =============================================
//  TOTAL
// =============================================
function updateTotal() {
  var total = cart.reduce(function (sum, item) {
    return sum + item.product.price * item.quantity;
  }, 0);
  document.getElementById('cartTotal').textContent = '₵' + formatPrice(total);
}

function formatPrice(num) {
  return num.toLocaleString('en-GH');
}

// =============================================
//  FORM VALIDATION
// =============================================
function validateName() {
  var val = document.getElementById('userName').value.trim();
  var err = document.getElementById('nameError');
  if (val === '') {
    err.textContent = 'Name is required.';
    return false;
  }
  err.textContent = '';
  return true;
}

function validateEmail() {
  var val = document.getElementById('userEmail').value.trim();
  var err = document.getElementById('emailError');
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === '') {
    err.textContent = 'Email is required.';
    return false;
  }
  if (!emailRegex.test(val)) {
    err.textContent = 'Enter a valid email address.';
    return false;
  }
  err.textContent = '';
  return true;
}

function validatePhone() {
  var val = document.getElementById('userPhone').value.trim();
  var err = document.getElementById('phoneError');
  var phoneRegex = /^[0-9]{10}$/;
  if (val === '') {
    err.textContent = 'Phone number is required.';
    return false;
  }
  if (!phoneRegex.test(val)) {
    err.textContent = 'Enter a valid 10-digit phone number.';
    return false;
  }
  err.textContent = '';
  return true;
}

function validateForm() {
  var nameOk  = validateName();
  var emailOk = validateEmail();
  var phoneOk = validatePhone();
  return nameOk && emailOk && phoneOk;
}

// =============================================
//  CHECKOUT
// =============================================
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before checking out.');
    return;
  }

  if (!validateForm()) {
    return;
  }

  // Collect user data
  user.name  = document.getElementById('userName').value.trim();
  user.email = document.getElementById('userEmail').value.trim();
  user.phone = document.getElementById('userPhone').value.trim();

  // Calculate total in pesewas (Paystack uses smallest currency unit)
  var totalGHS = cart.reduce(function (sum, item) {
    return sum + item.product.price * item.quantity;
  }, 0);
  // NOTE: Paystack Ghana uses pesewas (1 GHS = 100 pesewas)
  var amountInPesewas = totalGHS * 100;

  // Close cart before opening Paystack
  closeCart();

  // Fire Paystack
  var handler = PaystackPop.setup({
    key: 'pk_test_86edbc99dd3a308c79c4c0f1068586ddb6dc46da', // 🔑 Replace with your Paystack public test key
    email: user.email,
    amount: amountInPesewas,
    currency: 'GHS',
    ref: 'EMS_' + Math.floor(Math.random() * 1000000000 + 1),
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name',  variable_name: 'customer_name',  value: user.name  },
        { display_name: 'Phone Number',   variable_name: 'phone_number',   value: user.phone },
      ]
    },
    callback: function (response) {
      // Payment successful
      showSummary();
    },
    onClose: function () {
      // User closed Paystack without paying — do nothing
    }
  });

  handler.openIframe();
}

// =============================================
//  SUMMARY MODAL
// =============================================
function showSummary() {
  // Set thank you message
  document.getElementById('summaryTitle').textContent =
    'Thank You, ' + user.name + ', Your Order Has Been Received!';

  // Populate summary table
  var tbody = document.getElementById('summaryTableBody');
  tbody.innerHTML = '';
  cart.forEach(function (item, index) {
    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + (index + 1) + '</td>' +
      '<td>' + item.product.name + '</td>' +
      '<td>' + item.quantity + '</td>';
    tbody.appendChild(row);
  });

  document.getElementById('summaryOverlay').classList.add('active');
}

function closeSummary() {
  document.getElementById('summaryOverlay').classList.remove('active');
  clearAll();
  location.reload();
}

// =============================================
//  CLEAR ALL DATA
// =============================================
function clearAll() {
  cart = [];
  user = {};
  updateCartButton();
  updateAllProductButtons();
  document.getElementById('userName').value  = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userPhone').value = '';
}
