/**
 * CRISPY CRAVE - Core JavaScript
 * Handles Theme Toggling (Light/Dark), RTL Toggling, Mobile Navigation,
 * Intersection Observer Animations, Category Filtering, Order Notifications,
 * Lightbox Modal, and Form Validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Home 2 Hero Flavor Chips Selector
  const flavorChips = document.querySelectorAll('.flavor-chip');
  if (flavorChips.length > 0) {
    flavorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        flavorChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  initTheme();
  initRTL();
  initNavigation();
  initScrollAnimations();
  initCounterAnimations();
  initTestimonialSlider();
  initCategoryFilters();
  initLightbox();
  initOrderSystem();
  initWishlistSystem();
  initQuickViewModal();
  initForms();
  initBackToTop();
  initTouchHoverFeedback();
});

/* ==========================================
   1. Theme Management (Dark / Light)
========================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('crispy_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem('crispy_theme', activeTheme);
      showToast(`Switched to ${activeTheme.toUpperCase()} mode!`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = 'fa-solid fa-moon';
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  });
}

/* ==========================================
   2. RTL Management
========================================== */
function initRTL() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedRTL = localStorage.getItem('crispy_rtl');

  if (storedRTL === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('crispy_rtl', newDir);
      showToast(`Layout switched to ${newDir.toUpperCase()}`);
    });
  });
}

/* ==========================================
   3. Header Sticky & Mobile Drawer
========================================== */
function initNavigation() {
  const header = document.querySelector('.crave-header');
  const hamburger = document.querySelector('.crave-hamburger');
  const drawer = document.querySelector('.crave-mobile-drawer');
  const overlay = document.querySelector('.crave-mobile-overlay');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      drawer.classList.toggle('open');
      overlay.classList.toggle('active');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    overlay.addEventListener('click', closeMobileNav);

    const mobileCloseBtn = drawer.querySelector('.crave-mobile-close');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // Dropdown toggles inside mobile drawer
    const mobileDropdownToggles = drawer.querySelectorAll('.crave-mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = toggle.closest('.crave-mobile-dropdown');
        const sublinks = parent ? parent.querySelector('.crave-mobile-sublinks') : null;
        if (sublinks) {
          const isOpen = sublinks.classList.toggle('show');
          toggle.classList.toggle('open', isOpen);
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });
    
    // Close mobile nav when clicking any actual navigation link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function closeMobileNav() {
    hamburger?.classList.remove('active');
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================
   4. Scroll Triggered Entrance Animations
========================================== */
function initScrollAnimations() {
  const animatedSelectors = [
    '.anim-fade-up', '.anim-slide-left', '.anim-slide-right',
    '.stagger-card', '.pop-card', '.clip-reveal', '.zoom-reveal',
    '.anim-flip-x', '.anim-diagonal-slash', '.anim-roll-in',
    '.anim-step-cascade', '.anim-skew-card', '.anim-pulse-box',
    '.anim-iris-zoom', '.anim-curtain-fall', '.anim-ripple-wave',
    '.anim-border-flash', '.anim-swivel-card', '.anim-glide-up',
    '.anim-ticket-punch', '.anim-cinema-expand', '.anim-neon-jolt',
    '.anim-stamp-press', '.anim-shield-flip', '.anim-unfold-row',
    '.anim-contact-card', '.anim-form-elevate', '.anim-radar-map'
  ].join(', ');

  const animatedElements = document.querySelectorAll(animatedSelectors);

  // Immediately reveal any elements currently inside or near the viewport
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 120) {
      el.classList.add('visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Apply intelligent staggered delay for card lists & grids
          if (entry.target.parentElement) {
            const siblings = Array.from(entry.target.parentElement.children);
            const index = siblings.indexOf(entry.target);
            if (index >= 0) {
              entry.target.style.transitionDelay = `${(index % 4) * 0.1}s`;
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '120px 0px 80px 0px', threshold: 0.01 });

    animatedElements.forEach(el => observer.observe(el));

    // Robust safety fallback: ensure all content becomes visible within 600ms
    setTimeout(() => {
      animatedElements.forEach(el => el.classList.add('visible'));
    }, 600);
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================
   5. Animated Counters
========================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
          count += Math.ceil(target / 40);
          if (count >= target) {
            counter.innerText = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.innerText = count.toLocaleString();
          }
        }, stepTime || 30);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================
   6. Testimonial Carousel
========================================== */
function initTestimonialSlider() {
  const prevBtn = document.querySelector('.review-prev-btn');
  const nextBtn = document.querySelector('.review-next-btn');
  const slides = document.querySelectorAll('.review-slide');
  if (!slides.length || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
      if (i === index) {
        slide.classList.add('anim-fade-up');
        slide.classList.add('visible');
      }
    });
  }

  showSlide(0);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  // Auto slide every 7 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 7000);
}

/* ==========================================
   7. Category Filtering
========================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
  const filterItems = document.querySelectorAll('.filterable-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        if (filterVal === 'all' || item.getAttribute('data-category') === filterVal) {
          item.style.display = 'block';
          item.classList.add('visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   8. Lightbox Image Preview
========================================== */
function initLightbox() {
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');
  const closeBtn = document.querySelector('.cc-lightbox-close');

  if (!modal || !modalImg) return;

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-src') || trigger.querySelector('img')?.getAttribute('src');
      if (imgSrc) {
        modalImg.setAttribute('src', imgSrc);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================
   9. Interactive Order & Cart System (Reference E-Commerce Quality)
========================================== */
const DEFAULT_CART_ITEMS = [
  { id: 'master-bucket', name: 'Crispy Master Bucket (8 Pcs)', price: 22.99, qty: 1, img: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=300&q=80' },
  { id: 'inferno-wings', name: 'Nashville Inferno Wings (10 Pcs)', price: 14.50, qty: 1, img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80' }
];

let cartState = [];
try {
  const saved = localStorage.getItem('crispy_cart');
  cartState = saved ? JSON.parse(saved) : DEFAULT_CART_ITEMS;
} catch (e) {
  cartState = DEFAULT_CART_ITEMS;
}

let activePromoCode = localStorage.getItem('crispy_promo') || '';

function saveCart() {
  try {
    localStorage.setItem('crispy_cart', JSON.stringify(cartState));
  } catch (e) {}
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cartState.reduce((sum, item) => sum + item.qty, 0);
  
  // Update header badges
  document.querySelectorAll('[data-cart-count]').forEach(badge => {
    badge.textContent = totalItems;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  });

  const cartList = document.querySelector('#orderDrawerItems');
  const emptyState = document.querySelector('#orderDrawerEmpty');
  const footerState = document.querySelector('#orderDrawerFooter');
  const perksTrack = document.querySelector('#orderPerksFill');
  const perksMsg = document.querySelector('#orderPerksMsg');

  if (!cartList) return;

  if (cartState.length === 0) {
    cartList.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (footerState) footerState.style.display = 'none';
    if (perksTrack) perksTrack.style.width = '0%';
    if (perksMsg) perksMsg.innerHTML = '🔥 Add <strong>$35.00</strong> more to unlock Free Cheesy Dip!';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footerState) footerState.style.display = 'flex';

  // Render items
  cartList.innerHTML = cartState.map((item, idx) => `
    <div class="drawer-item-card" data-idx="${idx}">
      <img src="${item.img}" alt="${item.name}" class="drawer-item-thumb" loading="lazy">
      <div class="drawer-item-info">
        <h4 class="drawer-item-name">${item.name}</h4>
        <span class="drawer-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        <div class="drawer-qty-stepper">
          <button class="drawer-qty-btn btn-qty-dec" data-idx="${idx}" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
          <span class="drawer-qty-val">${item.qty}</span>
          <button class="drawer-qty-btn btn-qty-inc" data-idx="${idx}" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <button class="drawer-item-del btn-del-item" data-idx="${idx}" aria-label="Remove item" title="Remove">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  // Calculate bill
  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountRate = (activePromoCode.toUpperCase() === 'CRAVE20') ? 0.20 : 0.0;
  const discountAmount = subtotal * discountRate;
  const taxAmount = (subtotal - discountAmount) * 0.08;
  const totalAmount = (subtotal - discountAmount) + taxAmount;

  const subtotalEl = document.querySelector('#billSubtotal');
  const discountRowEl = document.querySelector('#billDiscountRow');
  const discountEl = document.querySelector('#billDiscount');
  const taxEl = document.querySelector('#billTax');
  const totalEl = document.querySelector('#billTotal');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountRowEl) {
    if (discountAmount > 0) {
      discountRowEl.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-$${discountAmount.toFixed(2)} (20% OFF)`;
    } else {
      discountRowEl.style.display = 'none';
    }
  }
  if (taxEl) taxEl.textContent = `$${taxAmount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${totalAmount.toFixed(2)}`;

  // Perks Progress
  const PERK_TARGET = 35.0;
  const progressPercent = Math.min(100, (subtotal / PERK_TARGET) * 100);
  if (perksTrack) perksTrack.style.width = `${progressPercent}%`;
  if (perksMsg) {
    if (subtotal >= PERK_TARGET) {
      perksMsg.innerHTML = '<i class="fa-solid fa-crown text-warning"></i> <strong>Perk Unlocked:</strong> Free Loaded Cheesy Dip Included!';
    } else {
      const remaining = (PERK_TARGET - subtotal).toFixed(2);
      perksMsg.innerHTML = `🔥 Add <strong>$${remaining}</strong> more to unlock Free Cheesy Dip!`;
    }
  }
}

function initOrderSystem() {
  const drawer = document.querySelector('#orderDrawer');
  const overlay = document.querySelector('.crave-drawer-overlay');
  const closeBtn = document.querySelector('#orderDrawerClose');
  const openBtns = document.querySelectorAll('.cart-drawer-btn');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Quantity Stepper & Delete delegation
  const cartList = document.querySelector('#orderDrawerItems');
  if (cartList) {
    cartList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.btn-qty-inc');
      const decBtn = e.target.closest('.btn-qty-dec');
      const delBtn = e.target.closest('.btn-del-item');

      if (incBtn) {
        const idx = parseInt(incBtn.dataset.idx, 10);
        if (cartState[idx]) {
          cartState[idx].qty += 1;
          saveCart();
        }
      } else if (decBtn) {
        const idx = parseInt(decBtn.dataset.idx, 10);
        if (cartState[idx]) {
          if (cartState[idx].qty > 1) {
            cartState[idx].qty -= 1;
          } else {
            cartState.splice(idx, 1);
          }
          saveCart();
        }
      } else if (delBtn) {
        const idx = parseInt(delBtn.dataset.idx, 10);
        if (cartState[idx]) {
          const removedName = cartState[idx].name;
          cartState.splice(idx, 1);
          saveCart();
          showToast(`Removed "${removedName}" from order bag.`);
        }
      }
    });
  }

  // Promo code apply
  const couponForm = document.querySelector('#couponForm');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = couponForm.querySelector('#couponInput');
      const code = input ? input.value.trim().toUpperCase() : '';
      if (code === 'CRAVE20') {
        activePromoCode = 'CRAVE20';
        localStorage.setItem('crispy_promo', 'CRAVE20');
        showToast('Promo CRAVE20 applied: 20% discount added! 🎉');
        updateCartUI();
      } else {
        showToast('Invalid promo code. Try "CRAVE20" for 20% off!');
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('#orderCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartState.length === 0) return;
      closeDrawer();
      showToast('🎉 Takeaway order confirmed! Estimated pickup in 15 mins.');
    });
  }

  // Add to order buttons on cards
  document.querySelectorAll('.btn-order-now, .btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card, .deal-card, .strip-product-card, .side-tile-card, .menu-col-item') || btn;
      const title = btn.getAttribute('data-item') || card.querySelector('.product-title, .deal-title, h3')?.textContent.trim() || 'Crispy Favorite';
      const priceText = card.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, '') || '12.99';
      const price = parseFloat(priceText) || 12.99;
      const img = card.querySelector('img')?.getAttribute('src') || 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=300&q=80';

      const existing = cartState.find(i => i.name.toLowerCase() === title.toLowerCase());
      if (existing) {
        existing.qty += 1;
      } else {
        cartState.push({
          id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: title,
          price: price,
          qty: 1,
          img: img
        });
      }

      saveCart();
      showToast(`Added "${title}" ($${price.toFixed(2)}) to bag! 🍗`, true);
    });
  });

  updateCartUI();
}

/* ==========================================
   10. Interactive Wishlist / Crave-List System
========================================== */
let wishState = [];
try {
  const saved = localStorage.getItem('crispy_wish');
  wishState = saved ? JSON.parse(saved) : [];
} catch (e) {
  wishState = [];
}

function saveWishlist() {
  try {
    localStorage.setItem('crispy_wish', JSON.stringify(wishState));
  } catch (e) {}
  updateWishUI();
}

function updateWishUI() {
  const totalWish = wishState.length;
  document.querySelectorAll('[data-wish-count]').forEach(badge => {
    badge.textContent = totalWish;
  });

  const wishList = document.querySelector('#wishlistDrawerItems');
  const emptyState = document.querySelector('#wishlistDrawerEmpty');

  if (!wishList) return;

  if (wishState.length === 0) {
    wishList.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  wishList.innerHTML = wishState.map((item, idx) => `
    <div class="drawer-item-card" data-idx="${idx}">
      <img src="${item.img}" alt="${item.name}" class="drawer-item-thumb" loading="lazy">
      <div class="drawer-item-info">
        <h4 class="drawer-item-name">${item.name}</h4>
        <span class="drawer-item-price">$${item.price.toFixed(2)}</span>
        <button class="btn-crave btn-crave-primary btn-crave-sm mt-1 btn-wish-to-cart" data-idx="${idx}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
          <i class="fa-solid fa-plus"></i> Move to Bag
        </button>
      </div>
      <button class="drawer-item-del btn-del-wish" data-idx="${idx}" aria-label="Remove item" title="Remove">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

function initWishlistSystem() {
  const drawer = document.querySelector('#wishlistDrawer');
  const overlay = document.querySelector('.crave-drawer-overlay');
  const closeBtn = document.querySelector('#wishlistDrawerClose');
  const openBtns = document.querySelectorAll('.wish-drawer-btn');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Add favorite buttons to product cards dynamically if missing
  document.querySelectorAll('.product-card, .strip-product-card, .deal-card').forEach(card => {
    if (!card.querySelector('.crave-card-fav')) {
      const favBtn = document.createElement('button');
      favBtn.className = 'crave-card-fav';
      favBtn.setAttribute('type', 'button');
      favBtn.setAttribute('title', 'Save to Crave-List');
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';

      const title = card.querySelector('.product-title, .deal-title, h3')?.textContent.trim() || '';
      const isFavorited = wishState.some(i => i.name.toLowerCase() === title.toLowerCase());
      if (isFavorited) {
        favBtn.classList.add('active');
        favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      }

      const imgWrap = card.querySelector('.product-img-wrap, .strip-img-wrap, .deal-img') || card;
      if (imgWrap) imgWrap.style.position = 'relative';
      (card.querySelector('.product-img-wrap, .strip-img-wrap') || card).appendChild(favBtn);

      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const priceText = card.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, '') || '12.99';
        const price = parseFloat(priceText) || 12.99;
        const img = card.querySelector('img')?.getAttribute('src') || '';

        const existingIdx = wishState.findIndex(i => i.name.toLowerCase() === title.toLowerCase());
        if (existingIdx > -1) {
          wishState.splice(existingIdx, 1);
          favBtn.classList.remove('active');
          favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
          showToast(`Removed "${title}" from Crave-List.`);
        } else {
          wishState.push({ name: title, price: price, img: img });
          favBtn.classList.add('active');
          favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
          showToast(`Saved "${title}" to your Crave-List! ❤️`);
        }
        saveWishlist();
      });
    }
  });

  // Wishlist item actions (Move to Bag & Delete)
  const wishList = document.querySelector('#wishlistDrawerItems');
  if (wishList) {
    wishList.addEventListener('click', (e) => {
      const moveBtn = e.target.closest('.btn-wish-to-cart');
      const delBtn = e.target.closest('.btn-del-wish');

      if (moveBtn) {
        const idx = parseInt(moveBtn.dataset.idx, 10);
        if (wishState[idx]) {
          const item = wishState[idx];
          const existing = cartState.find(i => i.name.toLowerCase() === item.name.toLowerCase());
          if (existing) existing.qty += 1;
          else cartState.push({ id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), name: item.name, price: item.price, qty: 1, img: item.img });
          saveCart();
          wishState.splice(idx, 1);
          saveWishlist();
          showToast(`Moved "${item.name}" to Order Bag! 🍗`, true);
        }
      } else if (delBtn) {
        const idx = parseInt(delBtn.dataset.idx, 10);
        if (wishState[idx]) {
          wishState.splice(idx, 1);
          saveWishlist();
          showToast('Item removed from Crave-List.');
        }
      }
    });
  }

  // Move all to bag
  const moveAllBtn = document.querySelector('#wishlistMoveAll');
  if (moveAllBtn) {
    moveAllBtn.addEventListener('click', () => {
      if (wishState.length === 0) return;
      wishState.forEach(item => {
        const existing = cartState.find(i => i.name.toLowerCase() === item.name.toLowerCase());
        if (existing) existing.qty += 1;
        else cartState.push({ id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), name: item.name, price: item.price, qty: 1, img: item.img });
      });
      wishState = [];
      saveCart();
      saveWishlist();
      closeDrawer();
      showToast('All Crave-List items moved to your Bag! 🍗', true);
    });
  }

  updateWishUI();
}

/* ==========================================
   11. Interactive Food Quick-View Modal
========================================== */
function initQuickViewModal() {
  const modal = document.querySelector('#quickViewModal');
  const closeBtn = document.querySelector('#quickViewClose');
  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Attach quick view on food images
  document.querySelectorAll('.product-img-wrap, .strip-img-wrap').forEach(wrap => {
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.crave-card-fav, .product-tag')) return;
      const card = wrap.closest('.product-card, .strip-product-card');
      if (!card) return;

      const title = card.querySelector('.product-title')?.textContent.trim() || 'Crispy Favorite';
      const desc = card.querySelector('.product-desc')?.textContent.trim() || 'Prepared with our signature 11-spice batter and fried to acoustic crunch perfection.';
      const priceText = card.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, '') || '12.99';
      const price = parseFloat(priceText) || 12.99;
      const img = card.querySelector('img')?.getAttribute('src') || '';

      const modalImg = modal.querySelector('#qvImage');
      const modalTitle = modal.querySelector('#qvTitle');
      const modalDesc = modal.querySelector('#qvDesc');
      const modalPrice = modal.querySelector('#qvPrice');
      const modalAddBtn = modal.querySelector('#qvAddToCart');

      if (modalImg) modalImg.src = img;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalPrice) modalPrice.textContent = `$${price.toFixed(2)}`;

      if (modalAddBtn) {
        modalAddBtn.onclick = () => {
          const qtyInput = modal.querySelector('#qvQty');
          const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
          const existing = cartState.find(i => i.name.toLowerCase() === title.toLowerCase());
          if (existing) existing.qty += qty;
          else cartState.push({ id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'), name: title, price: price, qty: qty, img: img });
          saveCart();
          closeModal();
          showToast(`Added ${qty}x "${title}" to Bag! 🍗`, true);
        };
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Sauce pills toggle inside modal
  modal.querySelectorAll('.crave-sauce-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      modal.querySelectorAll('.crave-sauce-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* ==========================================
   12. Enhanced Toast Notification with Actions
========================================== */
function showToast(message, showViewBag = false) {
  let toast = document.querySelector('.crave-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'crave-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <i class="fa-solid fa-circle-check" style="color: var(--secondary);"></i>
    <span class="toast-msg">${message}</span>
    ${showViewBag ? '<button class="crave-toast-btn" id="toastViewBagBtn">View Bag</button>' : ''}
  `;

  if (showViewBag) {
    const viewBtn = toast.querySelector('#toastViewBagBtn');
    if (viewBtn) {
      viewBtn.onclick = () => {
        toast.classList.remove('show');
        const drawer = document.querySelector('#orderDrawer');
        const overlay = document.querySelector('.crave-drawer-overlay');
        if (drawer) drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      };
    }
  }

  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================
   13. Form Validation & Submission
========================================== */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = contactForm.querySelector('#contactName')?.value.trim();
      const email = contactForm.querySelector('#contactEmail')?.value.trim();
      const phone = contactForm.querySelector('#contactPhone')?.value.trim();
      const subject = contactForm.querySelector('#contactSubject')?.value.trim();
      const message = contactForm.querySelector('#contactMessage')?.value.trim();
      const feedback = document.getElementById('contactFeedback');

      if (!name || !email || !phone || !subject || !message) {
        if (feedback) {
          feedback.innerHTML = '<div class="alert alert-danger" style="background: rgba(198,40,40,0.1); border: 1px solid var(--primary); color: var(--primary); padding: 0.8rem 1.2rem; border-radius: 8px;">Please fill in all required fields accurately.</div>';
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedback) {
          feedback.innerHTML = '<div class="alert alert-danger" style="background: rgba(198,40,40,0.1); border: 1px solid var(--primary); color: var(--primary); padding: 0.8rem 1.2rem; border-radius: 8px;">Please enter a valid email address.</div>';
        }
        return;
      }

      if (feedback) {
        feedback.innerHTML = '<div class="alert" style="background: rgba(255,179,0,0.15); border: 1px solid var(--secondary); color: var(--text-main); padding: 0.8rem 1.2rem; border-radius: 8px;"><i class="fa-solid fa-check-circle me-2" style="color: var(--primary);"></i>Thank you! Your message has been sent to Crispy Crave. We will respond shortly!</div>';
      }
      contactForm.reset();
      showToast('Message sent successfully! 🍗');
    });
  }

  // Newsletter form
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('Subscribed to Crispy Crave VIP deals! 🎉');
        input.value = '';
      }
    });
  });
}

/* ==========================================
   14. Back to Top Button
========================================== */
function initBackToTop() {
  const backToTopBtns = document.querySelectorAll('.back-to-top, .footer-back-to-top');

  window.addEventListener('scroll', () => {
    const isPast = window.scrollY > 400;
    document.querySelectorAll('.back-to-top').forEach(btn => {
      if (isPast) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  });

  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ==========================================
   15. Universal Touch & Hover Feedback
   Ensures hover/active feedback works in all views (touch/mobile/tablet/desktop)
========================================== */
function initTouchHoverFeedback() {
  // Activate :active pseudo-class on iOS Safari and mobile WebKit
  document.addEventListener('touchstart', () => {}, { passive: true });

  const interactiveSelectors = [
    '.footer-social-link',
    '.btn-crave',
    '.crave-icon-btn',
    '.cat-filter-btn',
    '.product-card',
    '.deal-card',
    '.review-card',
    '.strip-product-card',
    '.bento-card-featured',
    '.bento-card-compact',
    '.back-to-top',
    '.footer-links a',
    '.footer-newsletter-btn'
  ];

  document.querySelectorAll(interactiveSelectors.join(',')).forEach(el => {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') {
        el.classList.add('touch-active');
      }
    });
    el.addEventListener('touchstart', () => {
      el.classList.add('touch-active');
    }, { passive: true });

    el.addEventListener('touchend', () => {
      setTimeout(() => el.classList.remove('touch-active'), 350);
    }, { passive: true });

    el.addEventListener('touchcancel', () => {
      el.classList.remove('touch-active');
    }, { passive: true });
  });
}


