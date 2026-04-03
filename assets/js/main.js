/**
* Template Name: Yummy
* Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
  
  const lightboxSingle = GLightbox({
  selector: '.glightbox-single'
});

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

let cart = [];
let selectedLatLng = null;
let restaurantLatLng = [29.975525,-9.640738];
let map, customerMarker;

// ✅ إضافة منتج للسلة
function addToCart(name, price, image) {
  let item = cart.find(i => i.name === name);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  updateTotal();
  showCartBar();
}

// ✅ تحديث المجموع و البادج
function updateTotal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("total").innerText = "Total: " + total + " DH";

  const cartBadge = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = "inline-block";
  } else {
    cartBadge.style.display = "none";
  }
}

// ✅ إظهار cart-bar فقط إلا كان فيه عناصر + اهتزاز
function showCartBar() {
  const cartBar = document.querySelector(".cart-bar");
  if (cart.length > 0) {
    cartBar.style.display = "flex";

    // ✅ تهتز شوية
    cartBar.classList.add("shake");
    setTimeout(() => {
      cartBar.classList.remove("shake");
    }, 500);
  } else {
    cartBar.style.display = "none";
  }
}

// ✅ فتح صفحة السلة
function goToCartPage() {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }

  document.getElementById("cart-page").style.display = "block";
  showCartItems();
}

// ✅ إغلاق صفحة السلة
function closeCart() {
  document.getElementById("cart-page").style.display = "none";
}

// ✅ عرض العناصر داخل السلة
function showCartItems() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}">
      <div class="info">
        <strong>${item.name} ×${item.qty}</strong>
        <p>${item.price * item.qty} DH</p>
        <div class="qty-controls">
          <button onclick="changeQty(${index}, 1)">+</button>
          <button onclick="changeQty(${index}, -1)">-</button>
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>`;
    container.appendChild(div);
  });

  updateTotal();
}

// ✅ تغيير الكمية
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  showCartItems();
  updateTotal();
  showCartBar();
}

// ✅ حذف عنصر
function removeItem(index) {
  cart.splice(index, 1);
  showCartItems();
  updateTotal();
  showCartBar();
}

// ✅ عرض اختيارات الطلب (محلي أو توصيل)
function showOrderOptions() {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }
  document.getElementById("order-options").style.display = "block";
}

// ✅ اختيار نوع الطلب
function selectOption(type) {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }

  document.getElementById("order-options").style.display = "none";
  document.getElementById("order-button").style.display = "none";

  if (type === "delivery") {
    document.getElementById("map-container").style.display = "block";
    initMap();
  } else {
    document.getElementById("map-container").style.display = "none";
    sendWhatsAppOrder();
  }
}

// ====== إعدادات الخريطة للتوصيل
const deliveryRadius = 5700; // بالمتر

function getDistance(latlng1, latlng2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(latlng2.lat - latlng1.lat);
  const dLng = toRad(latlng2.lng - latlng1.lng);
  const lat1 = toRad(latlng1.lat);
  const lat2 = toRad(latlng2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
}


// ✅ تهيئة الخريطة عند التوصيل فقط
function initMap() {
  if (window.mapInitialized) return;
  window.mapInitialized = true;

  map = L.map('map').setView(restaurantLatLng, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // أيقونة المطعم (دائرية بالصورة)
  const restaurantIcon = L.divIcon({
    html: '<div class="restaurant-icon"><img src="assets/img/ii.png" alt="Restaurant"></div>',
    className: '',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });

  L.marker(restaurantLatLng, { icon: restaurantIcon })
    .addTo(map)
    .bindPopup("📍 من فضلك حدد موقعك بدقة")
    .openPopup();

  // دائرة التوصيل
  L.circle(restaurantLatLng, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2,
    radius: deliveryRadius
  }).addTo(map);

  // أيقونة الزبون (Font Awesome رجل واقف)
  const customerIcon = L.divIcon({
    html: '<div class="customer-icon"><i class="fas fa-male"></i></div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  // حدث عند الضغط على الخريطة
  map.on("click", function (e) {
    const dist = getDistance(e.latlng, { lat: restaurantLatLng[0], lng: restaurantLatLng[1] });
    if (dist > deliveryRadius) {
      alert("🛑 الموقع خارج منطقة التوصيل");
      return;
    }

    selectedLatLng = e.latlng;

    if (customerMarker) {
      customerMarker.setLatLng(selectedLatLng);
    } else {
      customerMarker = L.marker(selectedLatLng, { icon: customerIcon })
        .addTo(map)
        .bindPopup("✅ يعطيك الصحة، الموقع تسجّل ")
        .openPopup();
    }

    document.getElementById("send-order-button").style.display = "block";
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

// ✅ إرسال الطلب عبر واتساب
function sendWhatsAppOrder() {
  if (document.getElementById("map-container").style.display === "block" && !selectedLatLng) {
    alert("🛑 من فضلك حدد موقعك على الخريطة أولاً.");
    return;
  }

  let message = "🍽️ **تفاصيل الطلب**\n\n";
  cart.forEach(item => {
    message += `✓ ${item.name} ×${item.qty}: ${item.price * item.qty} DH\n`;
  });

  message += `\n💰 **المجموع:** ${cart.reduce((sum, i) => sum + i.price * i.qty, 0)} DH`;

  if (selectedLatLng) {
    message += `\n\n📍 **الموقع:** https://www.google.com/maps?q=${selectedLatLng.lat},${selectedLatLng.lng}`;
  }

message += `\n\n🍟 شكراً بزاف على طلبك من **Snack dwich** ❤️  
نتمنّاو ليك نكهة تعجبك وخدمة ترضيك.  
أنت ديما مرحّب بيك عند  Snack dwich 😊✨`;

  const url = "https://wa.me/212707997136?text=" + encodeURIComponent(message);
  window.open(url, "_blank");

  document.getElementById("map-container").style.display = "none";
  document.getElementById("send-order-button").style.display = "none";
}
