function money(cents) {
  if (window.Shopify?.formatMoney) {
    return Shopify.formatMoney(cents);
  }

  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
}

const Cart = {
  els: {},
  requestId: 0,

  init() {
    this.build();
  },

  build(force = false) {
    this.els.wrapper = $('.cart-form');
    if (!force && !this.els.wrapper.isVisible()) return;

    this.cache();
    this.bindQty();
    this.bindButtons();
    this.bindRemove();
    this.sync();
    this.fetch();
  },

  cache() {
    this.els.items = $$('.cart-item');
    this.els.subtotal = $('#cart-subtotal');
  },

  bindQty() {
    this.els.items.forEach(item => {
      const input = $(item).find('.cart-qty');
      if (input.el) input.on('change', e => this.update(e, item));
    });
  },

  bindButtons() {
    this.els.items.forEach(item => {
      const minus = $(item).find('.minus');
      const plus = $(item).find('.plus');
      const input = $(item).find('.cart-qty');

      if (minus.el) minus.on('click', e => this.step(e, item, -1));
      if (plus.el) plus.on('click', e => this.step(e, item, 1));

      if (input.el) {
        input.on('input', () => {
          input.el.value = input.el.value.replace(/\D/g, '');
          this.toggle(item);
        });
      }
    });
  },

  bindRemove() {
    this.els.items.forEach(item => {
      const btn = $(item).find('.cart-remove');
      if (btn.el) btn.on('click', e => this.remove(e, item));
    });
  },

  step(e, item, dir) {
    e.preventDefault();

    const input = $(item).find('.cart-qty');
    let qty = parseInt(input.el.value || 1, 10);

    qty = Math.max(1, qty + dir);
    input.el.value = qty;

    this.toggle(item);
    this.update({ target: input.el }, item);
  },

  update(e, item) {
    const qty = parseInt(e.target.value, 10);
    const line = parseInt(item.getAttribute('data-line'), 10);
    const requestId = ++this.requestId;

    if (!Number.isFinite(qty) || qty < 1 || !Number.isFinite(line)) return;

    gsap.to(item, { opacity: 0.6, duration: 0.15 });

    this.change(line, qty)
      .then(cart => {
        if (requestId !== this.requestId) return;
        this.afterChange(cart, item, line);
      })
      .finally(() => {
        gsap.to(item, { opacity: 1, duration: 0.15 });
      });
  },

  remove(e, item) {
    e.preventDefault();

    const key = this.itemKey(item);
    if (!key || item.dataset.removing === 'true') return;

    item.dataset.removing = 'true';
    item.style.pointerEvents = 'none';

    gsap.to(item, {
      opacity: 0,
      height: 0,
      margin: 0,
      padding: 0,
      duration: 0.3,
      onComplete: () => this.removeItem(item, key)
    });
  },

  removeItem(item, key) {
    this.changeByKey(key, 0)
      .then(cart => {
        if (item.parentNode) item.remove();

        this.reindex();
        this.apply(cart);
        this.empty(cart);
      })
      .then(() => this.fetch())
      .catch(err => {
        console.error('Cart change error:', err);
        this.fetch();
      });
  },

  fetch() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(cart => this.apply(cart));
  },

  afterChange(cart, item, line) {
    if (!this.valid(cart)) return this.fetch();

    if (cart.item_count === 0) {
      this.empty(cart);
      return;
    }

    this.enable();
    this.syncDrawer(cart);
    this.line(cart, item, line);
    this.render(cart);
    this.toggle(item);
  },

  apply(cart) {
    if (!this.valid(cart)) return;

    this.render(cart);
    this.syncDrawer(cart);

    if (cart.item_count > 0) {
      this.enable();
    }
  },

  valid(cart) {
    const total = Number(cart?.total_price);
    const count = Number(cart?.item_count);

    if (!Number.isFinite(total) || !Number.isFinite(count)) {
      console.warn('Invalid cart data:', cart);
      return false;
    }

    return true;
  },

  render(cart) {
    const total = Number(cart.total_price);
    const count = Number(cart.item_count);

    if (this.els.subtotal.el) {
      this.els.subtotal.el.textContent = money(total);
    }

    $$('.cart-count').forEach(el => {
      el.textContent = count;
    });
  },

  line(cart, item, line) {
    const data = cart.items[line - 1];
    if (!data) return;

    const total = $(item).find('.cart-total');
    if (total.el) total.el.textContent = money(data.line_price);
  },

  empty(cart) {
    if (cart && cart.item_count !== 0) return;

    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;

    gsap.to(cartContent, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => this.reload()
    });
  },

  reindex() {
    this.els.items = $$('.cart-item');

    this.els.items.forEach((item, i) => {
      item.setAttribute('data-line', i + 1);
      this.toggle(item);
    });
  },

  sync() {
    this.els.items.forEach(item => this.toggle(item));
  },

  toggle(item) {
    const input = $(item).find('.cart-qty');
    const minus = $(item).find('.minus');

    if (!input.el || !minus.el) return;

    const qty = parseInt(input.el.value || 1, 10);
    minus.el.disabled = qty <= 1;
  },

  enable() {
    document.querySelectorAll('[name="checkout"]').forEach(btn => {
      btn.classList.remove('disabled');
      btn.disabled = false;
    });
  },

  syncDrawer(cart) {
    if (Drawer.els.root?.el) {
      Drawer.sync(cart);
    }
  },

  itemKey(item) {
    return item.getAttribute('data-key');
  },

  change(line, quantity) {
    return this.changeCart({ line, quantity });
  },

  changeByKey(id, quantity) {
    return this.changeCart({ id, quantity });
  },

  changeCart(body) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }).then(r => r.json());
  },

  reload() {
    fetch(window.location.pathname)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const freshCart = doc.querySelector('.cart-content');
        const currentCart = document.querySelector('.cart-content');

        if (!freshCart || !currentCart) return;

        freshCart.style.opacity = 0;
        currentCart.replaceWith(freshCart);

        gsap.to(freshCart, {
          opacity: 1,
          duration: 0.25,
          ease: 'power1.out'
        });

        this.build(true);
      });
  }
};