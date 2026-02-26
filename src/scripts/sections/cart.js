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

  fetch() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(cart => {
        this.render(cart);
        if (cart.item_count > 0) {
          this.enable();
        }
      });
  },

  cache() {
    this.els.items = $$('.cart-item');
    this.els.subtotal = $('#cart-subtotal');
  },

  bindQty() {
    this.els.items.forEach(item => {
      const input = $(item).find('.cart-qty');
      if (!input.el) return;

      input.on('change', e => this.update(e, item));
    });
  },

  bindButtons() {
    this.els.items.forEach(item => {
      const minus = $(item).find('.minus');
      const plus = $(item).find('.plus');
      const input = $(item).find('.cart-qty');

      if (minus.el) {
        minus.on('click', e => this.step(e, item, -1));
      }

      if (plus.el) {
        plus.on('click', e => this.step(e, item, 1));
      }

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
      if (!btn.el) return;

      btn.on('click', e => this.remove(e, item));
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

  toggle(item) {
    const input = $(item).find('.cart-qty');
    const minus = $(item).find('.minus');

    if (!input.el || !minus.el) return;

    const qty = parseInt(input.el.value || 1, 10);
    minus.el.disabled = qty <= 1;
  },

  update(e, item) {
    const qty = parseInt(e.target.value, 10);
    const line = parseInt(item.getAttribute('data-line'), 10);

    gsap.to(item, { opacity: 0.6, duration: 0.15 });

    this.change(line, qty)
      .then(cart => {
        if (cart.item_count === 0) {
          gsap.to('.cart-content', {
            opacity: 0,
            duration: 0.2,
            onComplete: () => this.reload()
          });
          return;
        }

        this.enable();
        Drawer.sync(cart);
        this.line(cart, item, line);
        this.render(cart);
        this.toggle(item);
      })
      .finally(() => {
        gsap.to(item, { opacity: 1, duration: 0.15 });
      });
  },

  remove(e, item) {
    e.preventDefault();

    const line = parseInt(item.getAttribute('data-line'), 10);

    gsap.to(item, {
      opacity: 0,
      height: 0,
      margin: 0,
      padding: 0,
      duration: 0.3,
      onComplete: () => {
        this.change(line, 0)
          .then(cart => {
            if (item.parentNode) item.remove();
            this.reindex();
            this.render(cart);

            if (Drawer.els.root?.el) {
              Drawer.sync(cart);
            }

            if (cart.item_count === 0) {
              const cartContent = document.querySelector('.cart-content');
              if (cartContent) {
                gsap.to(cartContent, {
                  opacity: 0,
                  duration: 0.2,
                  onComplete: () => this.reload()
                });
              }
            }
          })
          .catch(err => console.error('Cart change error:', err));
      }
    });
  },


  line(cart, item, line) {
    const data = cart.items[line - 1];
    if (!data) return;

    const total = $(item).find('.cart-total');
    if (total.el) {
      total.el.textContent = money(data.line_price);
    }
  },

  render(cart) {
    if (this.els.subtotal.el) {
      this.els.subtotal.el.textContent = money(cart.total_price);
    }

    $$('.cart-count').forEach(el => {
      el.textContent = cart.item_count;
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

  change(line, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ line, quantity })
    }).then(r => r.json());
  },

  enable() {
    document
      .querySelectorAll('[name="checkout"]')
      .forEach(btn => {
        btn.classList.remove('disabled');
        btn.disabled = false;
      });
  },

  reload() {
    fetch(window.location.pathname)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Cart page
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