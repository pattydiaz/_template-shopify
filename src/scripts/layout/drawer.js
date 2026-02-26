const Drawer = {
  els: {},

  init() {
    this.build();
  },

  build() {
    if (document.body.classList.contains('cart')) return;

    this.cache();
    this.bind();
  },

  cache() {
    this.els.root = $('#cart-drawer');
    this.els.wrapper = this.els.root.find('.drawer-wrapper');
    this.els.overlay = this.els.root.find('.drawer-overlay');
    this.els.body = $('#drawer-body');
    this.els.close = $$('[data-drawer-close]');
  },

  bind() {
    this.els.close.forEach(el => {
      $(el).on('click', () => this.close());
    });
  },

  open() {
    if (document.body.classList.contains('cart')) return;

    Scrolling.lock();
    this.els.root.el.setAttribute('aria-hidden', 'false');

    gsap.set(this.els.wrapper.el, { x: '120%' });
    gsap.set(this.els.overlay.el, { opacity: 0 });

    gsap.to(this.els.wrapper.el, { x: '0%', duration: 0.35, ease: 'power3.out' });
    gsap.to(this.els.overlay.el, { opacity: 1, duration: 0.25, ease: 'power1.out' });
  },

  close() {
    gsap.to(this.els.wrapper.el, {
      x: '120%',
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(this.els.overlay.el, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            this.els.root.el.setAttribute('aria-hidden', 'true');
            Scrolling.unlock();
          }
        });
      }
    });
  },

  sync(cart) {
    if (document.body.classList.contains('cart')) return;

    const isEmpty = cart.item_count === 0;

    this.els.root.el.classList.toggle('drawer--empty', isEmpty);

    this.els.root.el
      .querySelectorAll('[name="checkout"]')
      .forEach(btn => {
        btn.disabled = isEmpty;
        btn.classList.toggle('disabled', isEmpty);
      });

    const emptyMsg = this.els.root.el.querySelector('.drawer-empty');
    if (emptyMsg) {
      emptyMsg.classList.toggle('d-none', !isEmpty);
    }
  },

  async refresh() {
    const res = await fetch('/?sections=layout-drawer');
    const json = await res.json();

    const html = json['layout-drawer'];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body = doc.querySelector('#drawer-body');

    if (body && this.els.body.el) {
      this.els.body.el.innerHTML = body.innerHTML;

      Cart.build(true);
      CartAdd.init();
    }
  }
};