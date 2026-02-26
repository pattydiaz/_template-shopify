const Page = {
  init() {
    this.build();
  },

  build() {
    if (page.isVisible()) {
      this.height();
      this.animate();
    }
  },

  height() {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.body.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
  },

  animate() {
    const page_anim = gsap.timeline();
    page_anim.to(page.el, {
      opacity: 1,
      duration: 0.5,
      onStart: () => Loader.init()
    });
  }
};
