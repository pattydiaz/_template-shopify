const CartAdd = {
  init() {
    this.bind();
  },

  bind() {
    $$('form[action^="/cart/add"]').forEach(form => {
      if (form.dataset.bound) return;
      form.dataset.bound = 'true';

      $(form).on('submit', e => this.submit(e, form));
    });
  },

  async submit(e, form) {
    e.preventDefault();

    const btn = e.submitter || form.querySelector('[type="submit"]');
    const shouldLoad = btn?.classList.contains('btn');

    if (shouldLoad) btn.classList.add('loading');

    try {
      const data = new FormData(form);

      await fetch('/cart/add.js', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      const cart = await res.json();

      await Drawer.refresh();
      Drawer.open();

      Cart.render(cart);
      Drawer.sync(cart);
    } finally {
      if (shouldLoad) btn.classList.remove('loading');
    }
  }
};