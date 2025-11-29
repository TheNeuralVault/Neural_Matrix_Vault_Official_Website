/**
 * NEURAL VAULT: SYSTEM CORE
 * Purpose: State management & Stripe Payment Integration
 */

// --- 0. STRIPE CONFIGURATION ---
// TODO: REPLACE THIS WITH YOUR STRIPE PUBLISHABLE KEY (Starts with pk_test_)
const STRIPE_KEY = 'pk_test_YOUR_KEY_HERE'; 

// Initialize Stripe
let stripe;
let elements;
let card;

try {
  stripe = Stripe(STRIPE_KEY);
} catch (e) {
  console.warn("Stripe Key missing or invalid. Payments will simulate only.");
}

// --- 1. STATE & STORE ---
const createStore = (initialState) => {
  let state = new Proxy(initialState, {
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  });
  return {
    get: (key) => state[key],
    set: (key, value) => { state[key] = value; },
    getState: () => state
  };
};

const store = createStore({
  cart: [],
  cartTotal: 0,
  latency: 12,
  inventory: [
    { id: 'NV-001', name: 'NEURAL WEAVE', rarity: 'legendary', price: 149.00, desc: 'High-bandwidth spinal interface. Latency 0.00ms.' },
    { id: 'NV-002', name: 'OPTIC SHIELD', rarity: 'epic', price: 89.00, desc: 'Anti-glare photonic barrier. Blocks 99% of blue radiation.' },
    { id: 'NV-003', name: 'DATA FRAGMENT', rarity: 'rare', price: 29.00, desc: 'Encrypted lore packet from the pre-collapse era.' }
  ]
});

// --- 2. SIGNAL BUS (Perception) ---
const bus = {
  listeners: [],
  subscribe(fn) { this.listeners.push(fn); },
  emit(signal) { this.listeners.forEach(fn => fn(signal)); }
};

// --- 3. REASONING & EFFECTS (Action) ---
const effects = {
  'init': () => {
    renderInventory();
    startHeartbeat();
    setupStripeElements();
  },

  'sys.tick': () => {
    // Fluctuate latency visually
    const variance = (Math.random() - 0.5) * 4;
    const newLat = Math.max(1, 12 + variance).toFixed(1);
    const el = document.getElementById('latency-display');
    if(el) el.innerHTML = `${newLat}<span>ms</span>`;
  },

  'shop.add': (id) => {
    const product = store.get('inventory').find(p => p.id === id);
    if(product) {
      const newCart = [...store.get('cart'), product];
      store.set('cart', newCart);
      updateCartUI();
    }
  },

  'shop.checkout': () => {
    if(store.get('cart').length === 0) return;
    
    const modal = document.getElementById('checkout-modal');
    const totalEl = document.getElementById('checkout-total-display');
    
    totalEl.innerText = `$${store.get('cartTotal').toFixed(2)}`;
    modal.style.display = 'grid'; // Show modal
  },

  'shop.cancel': () => {
    document.getElementById('checkout-modal').style.display = 'none';
  },

  'shop.pay': async () => {
    const btn = document.getElementById('pay-btn');
    const errorDisplay = document.getElementById('card-errors');
    
    btn.innerText = "ENCRYPTING...";
    btn.disabled = true;

    // SIMULATION MODE (If no key provided) or REAL MODE
    if (!stripe) {
      setTimeout(() => completePayment(true), 2000);
      return;
    }

    // REAL STRIPE TOKENIZATION
    const result = await stripe.createToken(card);

    if (result.error) {
      // Show error
      errorDisplay.textContent = result.error.message;
      btn.innerText = "AUTHORIZE PAYMENT";
      btn.disabled = false;
    } else {
      // Send the token to your server (Simulated here)
      console.log('Stripe Token Created:', result.token);
      completePayment(true);
    }
  }
};

// --- 4. HELPERS ---
function updateCartUI() {
  const cart = store.get('cart');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  store.set('cartTotal', total);
  
  const btn = document.getElementById('cart-trigger');
  btn.innerHTML = `CART [${cart.length}] • $${total.toFixed(2)}`;
  btn.classList.add('jewelry-accent');
  setTimeout(() => btn.classList.remove('jewelry-accent'), 300);
}

function renderInventory() {
  const container = document.getElementById('vault-shelves');
  const items = store.get('inventory');
  
  container.innerHTML = items.map(item => `
    <article class="product-card scent-hover tailored-container">
      <div class="product-visual ${item.rarity}">
        <div class="product-orb"></div>
      </div>
      <div class="product-info">
        <header>
          <h3 class="product-title">${item.name}</h3>
        </header>
        <p class="product-desc">${item.desc}</p>
        <footer class="product-footer">
          <span class="product-price">$${item.price.toFixed(2)}</span>
          <button class="btn-titanium btn-sm" onclick="bus.emit({type: 'shop.add', payload: '${item.id}'})">
            ADD TO CART
          </button>
        </footer>
      </div>
    </article>
  `).join('');
}

function startHeartbeat() {
  setInterval(() => bus.emit({type: 'sys.tick'}), 1000);
}

function setupStripeElements() {
  if(!stripe) return;
  elements = stripe.elements();
  
  // Custom styling for the Stripe Input to match our Theme
  const style = {
    base: {
      color: "#f0f0f0",
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" }
    },
    invalid: { color: "#ff2a2a", iconColor: "#ff2a2a" }
  };

  card = elements.create("card", { style: style });
  card.mount("#card-element");
}

function completePayment(success) {
  const modal = document.getElementById('checkout-modal');
  const btn = document.getElementById('pay-btn');
  
  if(success) {
    btn.innerText = "SUCCESS // ASSETS TRANSFERRED";
    btn.style.borderColor = "#00ff66";
    btn.style.color = "#00ff66";
    
    setTimeout(() => {
      store.set('cart', []);
      updateCartUI();
      modal.style.display = 'none';
      btn.innerText = "AUTHORIZE PAYMENT"; // Reset
      btn.style.borderColor = "var(--color-accent)";
      btn.style.color = "var(--color-accent)";
      btn.disabled = false;
      if(card) card.clear();
    }, 2000);
  }
}

// --- 5. INITIALIZATION ---
bus.subscribe(signal => {
  if (effects[signal.type]) effects[signal.type](signal.payload);
});

// Click Handler for Payment
document.getElementById('pay-btn').addEventListener('click', () => bus.emit({type: 'shop.pay'}));

// Boot
bus.emit({type: 'init'});
