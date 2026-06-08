// =============================================
//  EMS — E-Millenial Store  |  script.js
// =============================================

// --- State ---
var cart = [];
var user = {};
var currentFilter = 'all';

// =============================================
//  CART TOGGLE
// =============================================
function toggleCart(productId) {
  if (isInCart(productId)) {
    removeFromCart(productId);
    showToast('Removed from cart', 'remove', getProduct(productId).name);
  } else {
    addToCart(productId);
    showToast('Added to cart', 'add', getProduct(productId).name);
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

function getCartItem(productId) {
  return cart.find(function (item) {
    return item.product.id === productId;
  });
}

// =============================================
//  UPDATE UI
// =============================================
function updateCartButton() {
  document.getElementById('cartCount').textContent = cart.length;
  // Bounce animation on count badge
  var badge = document.getElementById('cartCount');
  badge.classList.remove('bounce');
  void badge.offsetWidth; // reflow
  badge.classList.add('bounce');
}

function updateProductButton(productId) {
  var btn  = document.getElementById('btn-' + productId);
  var card = document.getElementById('card-' + productId);
  if (!btn) return;
  if (isInCart(productId)) {
    btn.textContent = 'REMOVE FROM CART';
    btn.classList.add('remove-btn');
    if (card) card.classList.add('in-cart');
  } else {
    btn.textContent = 'ADD TO CART';
    btn.classList.remove('remove-btn');
    if (card) card.classList.remove('in-cart');
  }
}

function updateAllProductButtons() {
  products.forEach(function (p) {
    updateProductButton(p.id);
  });
}

// =============================================
//  FILTER PRODUCTS
// =============================================
function filterProducts(category, btnEl) {
  currentFilter = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  if (btnEl) btnEl.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('.product-card').forEach(function (card) {
    var cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.classList.remove('hidden');
      card.classList.remove('fade-in');
      void card.offsetWidth;
      card.classList.add('fade-in');
    } else {
      card.classList.add('hidden');
    }
  });
}

// =============================================
//  CART MODAL
// =============================================
function openCart() {
  renderCartTable();
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function handleOverlayClick(event) {
  if (event.target === document.getElementById('cartOverlay')) {
    closeCart();
  }
}

document.getElementById('cartBtn').addEventListener('click', openCart);

// =============================================
//  RENDER CART TABLE
// =============================================
function renderCartTable() {
  var tbody   = document.getElementById('cartTableBody');
  var emptyMsg = document.getElementById('emptyCartMsg');
  tbody.innerHTML = '';

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    document.getElementById('cartTable').style.display = 'none';
    updateTotal();
    return;
  }

  emptyMsg.style.display = 'none';
  document.getElementById('cartTable').style.display = 'table';

  cart.forEach(function (item, index) {
    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + (index + 1) + '</td>' +
      '<td><strong>' + item.product.name + '</strong></td>' +
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
  if (item) { item.quantity += 1; renderCartTable(); }
}

function decrementQty(productId) {
  var item = getCartItem(productId);
  if (!item) return;
  if (item.quantity > 1) {
    item.quantity -= 1;
    renderCartTable();
  } else {
    removeItemFromCart(productId);
  }
}

function removeItemFromCart(productId) {
  removeFromCart(productId);
  updateCartButton();
  updateProductButton(productId);
  renderCartTable();
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
  var input = document.getElementById('userName');
  if (val === '') {
    err.textContent = 'Name is required.';
    input.style.borderColor = 'var(--red)';
    return false;
  }
  err.textContent = '';
  input.style.borderColor = 'var(--success)';
  return true;
}

function validateEmail() {
  var val = document.getElementById('userEmail').value.trim();
  var err = document.getElementById('emailError');
  var input = document.getElementById('userEmail');
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === '') {
    err.textContent = 'Email is required.';
    input.style.borderColor = 'var(--red)';
    return false;
  }
  if (!emailRegex.test(val)) {
    err.textContent = 'Enter a valid email address.';
    input.style.borderColor = 'var(--red)';
    return false;
  }
  err.textContent = '';
  input.style.borderColor = 'var(--success)';
  return true;
}

function validatePhone() {
  var val = document.getElementById('userPhone').value.trim();
  var err = document.getElementById('phoneError');
  var input = document.getElementById('userPhone');
  var phoneRegex = /^[0-9]{10}$/;
  if (val === '') {
    err.textContent = 'Phone number is required.';
    input.style.borderColor = 'var(--red)';
    return false;
  }
  if (!phoneRegex.test(val)) {
    err.textContent = 'Enter a valid 10-digit phone number.';
    input.style.borderColor = 'var(--red)';
    return false;
  }
  err.textContent = '';
  input.style.borderColor = 'var(--success)';
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
    showToast('Your cart is empty!', 'remove', 'Add items first');
    return;
  }
  if (!validateForm()) return;

  user.name  = document.getElementById('userName').value.trim();
  user.email = document.getElementById('userEmail').value.trim();
  user.phone = document.getElementById('userPhone').value.trim();

  var totalGHS = cart.reduce(function (sum, item) {
    return sum + item.product.price * item.quantity;
  }, 0);
  var amountInPesewas = totalGHS * 100;

  closeCart();

  var handler = PaystackPop.setup({
    key: 'pk_test_86edbc99dd3a308c79c4c0f1068586ddb6dc46da',
    email: user.email,
    amount: amountInPesewas,
    currency: 'GHS',
    ref: 'EMS_' + Math.floor(Math.random() * 1000000000 + 1),
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: user.name },
        { display_name: 'Phone Number',  variable_name: 'phone_number',  value: user.phone }
      ]
    },
    callback: function (response) {
      showSummary();
    },
    onClose: function () {
      // User closed Paystack — reopen cart so they don't lose their items
      openCart();
    }
  });

  handler.openIframe();
}

// =============================================
//  SUMMARY MODAL
// =============================================
function showSummary() {
  document.getElementById('summaryTitle').textContent =
    'Thank You, ' + user.name + ', Your Order Has Been Received!';

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

// =============================================
//  TOAST NOTIFICATIONS
// =============================================
function showToast(action, type, productName) {
  var container = document.getElementById('toastContainer');
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<i class="fas fa-' + (type === 'add' ? 'check-circle' : 'minus-circle') + '"></i>' +
    '<span><strong>' + productName + '</strong> ' + action + '</span>';
  container.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(function () { toast.remove(); }, 380);
  }, 2800);
}

// =============================================
//  NEWSLETTER SUBSCRIBE
// =============================================
function subscribeNewsletter() {
  var input = document.getElementById('newsletterEmail');
  var val   = input.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val || !emailRegex.test(val)) {
    showToast('Enter a valid email address', 'remove', 'Newsletter');
    return;
  }
  showToast('Successfully subscribed!', 'add', val);
  input.value = '';
}

// =============================================
//  MOBILE MENU
// =============================================
function toggleMenu() {
  var navLinks  = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// =============================================
//  POINTER FOLLOWER
// =============================================
document.addEventListener('mousemove', function (e) {
  var follower = document.getElementById('pointerFollower');
  if (follower) {
    follower.style.left = e.clientX + 'px';
    follower.style.top  = e.clientY + 'px';
  }
});

// Grow on hover over interactive elements
document.addEventListener('mouseover', function (e) {
  var follower = document.getElementById('pointerFollower');
  if (!follower) return;
  var tag = e.target.tagName.toLowerCase();
  var isInteractive = ['a','button','input'].includes(tag) ||
    e.target.classList.contains('product-card') ||
    e.target.classList.contains('filter-btn');
  if (isInteractive) {
    follower.style.width  = '60px';
    follower.style.height = '60px';
    follower.style.opacity = '0.6';
  } else {
    follower.style.width  = '36px';
    follower.style.height = '36px';
    follower.style.opacity = '1';
  }
});

// =============================================
//  SCROLL REVEAL
// =============================================
function initReveal() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children if parent is a grid
        var children = entry.target.querySelectorAll('.reveal');
        children.forEach(function (child, i) {
          setTimeout(function () {
            child.classList.add('visible');
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}

// =============================================
//  BACK TO TOP
// =============================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
  var btn = document.getElementById('backToTop');
  if (window.scrollY > 500) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

// =============================================
//  NAVBAR SCROLL EFFECT
// =============================================
window.addEventListener('scroll', function () {
  var header = document.querySelector('header');
  if (window.scrollY > 60) {
    header.style.background = 'rgba(13,13,26,0.95)';
  } else {
    header.style.background = 'rgba(13,13,26,0.7)';
  }
});

// =============================================
//  CART BADGE BOUNCE STYLE
// =============================================
(function injectBounceStyle() {
  var style = document.createElement('style');
  style.textContent =
    '@keyframes badgeBounce { 0%,100%{transform:scale(1)} 40%{transform:scale(1.5)} 70%{transform:scale(0.9)} }' +
    '.bounce { animation: badgeBounce 0.45s cubic-bezier(0.4,0,0.2,1); }';
  document.head.appendChild(style);
})();

// =============================================
//  INIT
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  initReveal();
  updateCartButton();
});
