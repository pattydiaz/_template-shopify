const Wrapper = {
  init() {
    this.build();
  },

  build() {
    this.height();
    window.addEventListener('resize', () => this.height(), { passive: true });
  },

  height() {
    if (!wrapper.isVisible()) return;

    wrapper.el.style.minHeight = '';
    wrapper.el.dataset.height = wrapper.el.offsetHeight;

    const wh = window.innerHeight;
    const footerHeight = footer.el ? footer.el.offsetHeight : 0;
    const nh = wh - footerHeight;

    if (wh > wrapper.el.offsetHeight) {
      wrapper.el.style.minHeight = `${nh}px`;
    }
  }
};
