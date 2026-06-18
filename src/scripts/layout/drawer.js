const Drawer = {
  els: {},
  isOpen: false,

  init() {
    this.build();
  },

  build() {
    if (document.body.classList.contains('cart')) return;

    this.cache();
    this.bind();
    this.state();
  },

  state() {
    if (!this.els.root?.el) return;

    this.els.root.el.setAttribute(
      'aria-hidden',
      this.isOpen ? 'false' : 'true'
    );
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

    this.isOpen = true;
    this.state();

    Scrolling.lock();

    gsap.killTweensOf([
      this.els.wrapper.el,
      this.els.overlay.el
    ]);

    gsap.set(this.els.wrapper.el, { x: '120%' });
    gsap.set(this.els.overlay.el, { opacity: 0 });

    gsap.to(this.els.wrapper.el, { x: '0%', duration: 0.35, ease: 'power3.out' });
    gsap.to(this.els.overlay.el, { opacity: 1, duration: 0.25, ease: 'power1.out' });
  },

  close() {
    this.isOpen = false;
    this.state();

    gsap.killTweensOf([
      this.els.wrapper.el,
      this.els.overlay.el
    ]);

    gsap.to(this.els.wrapper.el, {
      x: '120%',
      duration: 0.2,
      ease: 'power2.in'
    });

    gsap.to(this.els.overlay.el, {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        this.state();
        Scrolling.unlock();
      }
    });
  },

  sync(cart) {
    if (document.body.classList.contains('cart')) return;

    this.state();

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

      this.cache();
      this.bind();
      this.state();

      Cart.build(true);
      CartAdd.init();
    }
  }
};