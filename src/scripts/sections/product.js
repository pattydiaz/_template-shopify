const groups = root => Array.from(root.querySelectorAll('#variant-options fieldset, #variant-options select'));

const Product = {
  init() {
    this.currentVariantId = null;

    this.product = document.querySelector('.product');
    this.form = this.product?.querySelector('.product-form');

    if (!this.product || !this.form) return;

    this.build();
  },

  build() {
    const form = this.form;

    this.variantInput = form.querySelector('#variant-id');
    this.priceEl = document.querySelector('#product-price');
    this.addBtn = document.querySelector('#add-to-cart-button');
    this.qtyInput = form.querySelector('#ProductQuantity');
    this.minusBtn = form.querySelector('.minus');
    this.plusBtn = form.querySelector('.plus');

    this.auto();
    this.url();
    this.toggle();

    document.addEventListener('change', e => this.change(e));
    this.bindQty();
  },

  change(e) {
    if (!e.target.classList.contains('variant-option')) return;
    this.update();
  },

  get() {
    return groups(this.product).map(group => {
      if (group.tagName === 'FIELDSET') {
        const radio = group.querySelector('input.variant-option:checked');
        return radio && !radio.disabled ? radio.value : null;
      }

      return group.value || null;
    });
  },

  update() {
    const values = this.get();
    if (values.includes(null)) return this.toggle(false);

    const variant = product_variants.find(v =>
      v.options.every((opt, i) => opt === values[i])
    );

    if (!variant) return this.toggle(false);

    this.variantInput.value = variant.id;
    this.price(variant.price);
    this.toggle(variant.available);
    this.updateURL(variant.id);
    this.slideto(variant.id);

    if (this.currentVariantId !== variant.id) {
      this.currentVariantId = variant.id;
      this.fetch(variant.id);
    }

    if (this.qtyInput) {
      this.qtyInput.value = 1;
      this.toggleQty();
    }
  },

  toggle(force) {
    const ready = force !== undefined ? force : this.get().every(Boolean);
    if (!this.addBtn) return;
    this.addBtn.disabled = !ready;
    this.addBtn.classList.toggle('disabled', !ready);
  },

  updateURL(id) {
    const u = new URL(location.href);
    u.searchParams.set('variant', id);
    history.replaceState({}, '', u);
  },

  url() {
    const param = new URLSearchParams(location.search).get('variant');
    const variant =
      product_variants.find(v => v.id == param) ||
      product_variants.find(v => v.available);

    if (!variant) return;

    this.variantInput.value = variant.id;
    this.price(variant.price);

    variant.options.forEach(val => {
      const el = document.querySelector(`.variant-option[value="${val}"]`);
      if (!el || el.disabled) return;
      if (el.type === 'radio') el.checked = true;
      else el.value = val;
    });

    this.update();
  },

  auto() {
    groups(this.product).forEach(group => {
      if (group.tagName === 'FIELDSET') {
        const radios = [...group.querySelectorAll('input.variant-option')]
          .filter(r => !r.disabled);

        if (!radios.some(r => r.checked) && radios[0]) {
          radios[0].checked = true;
        }
      } else {
        if (!group.value) {
          const opt = group.querySelector('option:not([disabled])');
          if (opt) group.value = opt.value;
        }
      }
    });
  },

  fetch(id) {
    fetch(`${location.pathname}?variant=${id}`)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const updated = doc.querySelector('#variant-options');

        if (!updated) return;

        const container = document.querySelector('#variant-options');
        container.innerHTML = updated.innerHTML;

        this.auto();
        this.update();
      });
  },

  slideto(id) {
    document.querySelectorAll('.product-slider').forEach(slider => {
      const swiperEl = slider.querySelector('.swiper');

      if (!swiperEl) return;

      const swiper = swiperEl.swiper;
      if (!swiper) {
        requestAnimationFrame(() => this.slideto(id));
        return;
      }

      const slides = [...swiperEl.querySelectorAll('.swiper-slide')];

      const index = slides.findIndex(slide =>
        slide.dataset.variantId
          ?.split(',')
          .includes(String(id))
      );

      if (index !== -1) {
        swiper.slideTo(index, 500);
      }
    });
  },

  price(cents) {
    if (!this.priceEl) return;
    this.priceEl.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  },

  bindQty() {
    if (!this.qtyInput || !this.minusBtn || !this.plusBtn) return;

    this.minusBtn.addEventListener('click', e => this.step(e, -1));
    this.plusBtn.addEventListener('click', e => this.step(e, 1));
    this.qtyInput.addEventListener('input', () => this.toggleQty());

    this.toggleQty();
  },

  step(e, dir) {
    e.preventDefault();
    e.stopPropagation();
    let val = parseInt(this.qtyInput.value, 10) || 1;
    this.qtyInput.value = Math.max(1, val + dir);
    this.toggleQty();
  },

  toggleQty() {
    const val = parseInt(this.qtyInput.value, 10) || 1;
    this.minusBtn.disabled = val <= 1;
    this.minusBtn.classList.toggle('disabled', val <= 1);
    this.qtyInput.value = val;
  }
};
