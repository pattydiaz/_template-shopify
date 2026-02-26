const Loader = {
  init() {
    this.build();
  },

  build() {
    Scrolling.lock();
    loader.isVisible() ? this.primary() : this.fallback();
  },

  primary() {
    const loader_anim = gsap.timeline();
    // Add GSAP steps here if needed
  },

  fallback() {
    this.animate();
  },

  animate(delay = 0) {
    setTimeout(() => {
      lazyload = new LazyLoad(lazyloadSettings);

      document.body.classList.add('loaded');
      
      Wrapper.init();
      Scrolling.init();
      Scrolling.unlock();
      // Hero.init();
      
    }, delay);
  }
};
