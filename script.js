const menuItems = [
  { id: 1, name: "Whataaa Classic", cat: "burger", price: 650, img: "images/classic.jpg", desc: "Juicy beef patty, cheddar, lettuce, tomato, pickles & our secret Whataaa sauce.", badge: "Bestseller", rating: 4.9 },
  { id: 2, name: "Triple Stack", cat: "burger", price: 1150, img: "images/triple.jpg", desc: "Three smashed beef patties, triple cheese, caramelised onions. Not for the weak.", badge: "Hot", hot: true, rating: 4.8 },
  { id: 3, name: "Smash Double", cat: "burger", price: 850, img: "images/smash.jpg", desc: "Two crispy-edged smash patties, American cheese & house pickles.", rating: 4.8 },
  { id: 4, name: "Beef Bacon Beast", cat: "burger", price: 990, img: "images/beef-bacon.jpg", desc: "Double beef, smoked beef bacon, melted cheese & smoky BBQ glaze.", badge: "New", rating: 4.7 },
  { id: 5, name: "Cheese Lava", cat: "burger", price: 750, img: "images/cheese.jpg", desc: "Flame-grilled beef loaded with molten cheese, onion rings & jalapeños.", rating: 4.7 },
  { id: 6, name: "Zinger Crunch", cat: "chicken", price: 590, img: "images/zinger.jpg", desc: "Crispy spicy chicken fillet, fresh lettuce, mayo on a toasted sesame bun.", badge: "Spicy", hot: true, rating: 4.9 },
  { id: 7, name: "Pulled Chicken Melt", cat: "chicken", price: 690, img: "images/chicken-burger.jpg", desc: "Slow-cooked pulled chicken in creamy chipotle sauce with coleslaw.", rating: 4.6 },
  { id: 8, name: "Crispy Wings (8 pcs)", cat: "chicken", price: 850, img: "images/wings.jpg", desc: "Golden fried wings tossed in your choice of hot, BBQ or honey garlic.", rating: 4.8 },
  { id: 9, name: "Chicken Tenders", cat: "chicken", price: 720, img: "images/tenders.jpg", desc: "Hand-breaded tenders with garlic mayo dip. Crunchy outside, juicy inside.", rating: 4.7 },
  { id: 10, name: "Classic Fries", cat: "sides", price: 290, img: "images/fries.jpg", desc: "Golden, crispy, perfectly salted. The way fries should be.", rating: 4.6 },
  { id: 11, name: "Loaded Fries", cat: "sides", price: 550, img: "images/loaded-fries.jpg", desc: "Fries smothered in cheese sauce, jalapeños & crispy chicken bits.", badge: "Must Try", rating: 4.9 },
  { id: 12, name: "Street Hot Dog", cat: "sides", price: 480, img: "images/hotdog.jpg", desc: "Grilled beef sausage, salsa, mustard & crispy onions in a soft bun.", rating: 4.5 },
  { id: 13, name: "Oreo Freakshake", cat: "drinks", price: 650, img: "images/oreo-shake.jpg", desc: "Thick Oreo shake topped with whipped cream, cookies & chocolate drizzle.", badge: "Fan Fave", rating: 4.9 },
  { id: 14, name: "Chocolate Shake", cat: "drinks", price: 520, img: "images/choco-shake.jpg", desc: "Rich, creamy Belgian chocolate shake made with real ice cream.", rating: 4.7 },
  { id: 15, name: "Chilled Soft Drink", cat: "drinks", price: 150, img: "images/drinks.jpg", desc: "Ice-cold can of your favourite fizzy drink.", rating: 4.5 },
];

const deals = {
  d1: { id: "d1", name: "Mega Meal Deal", price: 1199, img: "images/burger-fries.jpg" },
  d2: { id: "d2", name: "Couple Combo", price: 1499, img: "images/duo.jpg" },
  d3: { id: "d3", name: "Family Bucket", price: 2699, img: "images/wings.jpg" },
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmt = (n) => "Rs. " + n.toLocaleString("en-PK");

// Render menu
const grid = $("#menuGrid");
function renderMenu(filter = "all") {
  const list = filter === "all" ? menuItems : menuItems.filter((i) => i.cat === filter);
  grid.innerHTML = list.map((i, idx) => `
    <article class="item" style="animation-delay:${idx * 0.06}s">
      <div class="item-img">
        <img src="${i.img}" alt="${i.name}" loading="lazy" />
        ${i.badge ? `<span class="item-badge ${i.hot ? "hot" : ""}">${i.badge}</span>` : ""}
        <span class="item-rating"><i class="fa-solid fa-star"></i> ${i.rating}</span>
      </div>
      <div class="item-body">
        <h3>${i.name}</h3>
        <p>${i.desc}</p>
        <div class="item-foot">
          <span class="price">${fmt(i.price)}</span>
          <button class="add-btn" data-id="${i.id}" aria-label="Add ${i.name} to cart"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    </article>`).join("");
}
renderMenu();

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  $$(".filter").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(btn.dataset.filter);
});

// Cart
let cart = JSON.parse(localStorage.getItem("whataaa-cart") || "[]");
const saveCart = () => localStorage.setItem("whataaa-cart", JSON.stringify(cart));

function addToCart(product) {
  const found = cart.find((c) => c.id === product.id);
  found ? found.qty++ : cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  saveCart();
  updateCart();
  const count = $("#cartCount");
  count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump");
  toast(`<i class="fa-solid fa-circle-check"></i> ${product.name} added to cart`);
}

function updateCart() {
  const items = $("#cartItems");
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  $("#cartCount").textContent = totalQty;
  if (!cart.length) {
    items.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-burger"></i><p>Your cart is empty.<br/>Let's fix that!</p></div>`;
  } else {
    items.innerHTML = cart.map((c) => `
      <div class="cart-item">
        <img src="${c.img}" alt="${c.name}" />
        <div class="cart-item-info"><strong>${c.name}</strong><span>${fmt(c.price * c.qty)}</span></div>
        <div class="qty">
          <button data-act="dec" data-id="${c.id}">−</button>
          <span>${c.qty}</span>
          <button data-act="inc" data-id="${c.id}">+</button>
        </div>
      </div>`).join("");
  }
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 1500 ? 0 : 150;
  $("#subtotal").textContent = fmt(subtotal);
  $("#delivery").textContent = delivery === 0 && subtotal > 0 ? "FREE" : fmt(delivery);
  $("#total").textContent = fmt(subtotal + delivery);
}
updateCart();

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) addToCart(menuItems.find((i) => i.id == btn.dataset.id));
});
$$(".add-deal").forEach((b) => b.addEventListener("click", () => addToCart(deals[b.dataset.id])));

$("#cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const item = cart.find((c) => String(c.id) === btn.dataset.id);
  if (btn.dataset.act === "inc") item.qty++;
  else if (--item.qty === 0) cart = cart.filter((c) => c !== item);
  saveCart();
  updateCart();
});

const openCart = () => { $("#cart").classList.add("open"); $("#overlay").classList.add("show"); };
const closeCart = () => { $("#cart").classList.remove("open"); $("#overlay").classList.remove("show"); };
$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkout").addEventListener("click", () => {
  if (!cart.length) return toast(`<i class="fa-solid fa-circle-info"></i> Add something tasty first!`);
  cart = []; saveCart(); updateCart(); closeCart();
  toast(`<i class="fa-solid fa-circle-check"></i> Order placed! Your food is on the way 🍔`);
});

// Toast
let toastTimer;
function toast(html) {
  const t = $("#toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// Navbar: mobile toggle, scroll state, active links
$("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach((a) => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

const sections = $$("section[id]");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $("#navbar").classList.toggle("scrolled", y > 20);
  $("#backTop").classList.toggle("show", y > 600);
  sections.forEach((s) => {
    if (y >= s.offsetTop - 120 && y < s.offsetTop + s.offsetHeight - 120) {
      $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + s.id));
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

// Stat counters
$$("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => { n += Math.ceil(target / 40); if (n >= target) n = target; el.textContent = n; if (n < target) requestAnimationFrame(step); };
  setTimeout(step, 400);
});

// Countdown to midnight
function tick() {
  const now = new Date();
  const end = new Date(now); end.setHours(24, 0, 0, 0);
  let diff = Math.floor((end - now) / 1000);
  const h = Math.floor(diff / 3600); diff %= 3600;
  $("#hh").textContent = String(h).padStart(2, "0");
  $("#mm").textContent = String(Math.floor(diff / 60)).padStart(2, "0");
  $("#ss").textContent = String(diff % 60).padStart(2, "0");
}
tick(); setInterval(tick, 1000);

// Forms
$("#contactForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast(`<i class="fa-solid fa-calendar-check"></i> Table reserved! We'll call you to confirm.`); });
$("#newsletter").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast(`<i class="fa-solid fa-envelope-circle-check"></i> Subscribed! Get ready for tasty deals.`); });

$("#year").textContent = new Date().getFullYear();
