const Parallax = {
  init() {
    this.build();
  },

  build() {
    this.animate();
  },

  animate() {
    const parallaxEls = $$('.parallax');

    parallaxEls.forEach(el => {
      const $el = $(el);

      const $item = $el.el.classList.contains('parallax-item')
        ? $el
        : $el.find('.parallax-item');

      if (!$item.el) return;

      const dataset = $el.el.dataset;
      const percent = dataset.percent ? parseFloat(dataset.percent) : 20;
      const scrub = dataset.scrub !== undefined ? dataset.scrub === "true" : true;
      const offset = dataset.offset ? parseFloat(dataset.offset) : 0;

      const initialY = $el.el.classList.contains('no-offset')
        ? offset
        : percent;

      gsap.set($item.el, { yPercent: initialY });

      gsap.to($item.el, {
        yPercent: percent * -1,
        ease: 'none',
        scrollTrigger: {
          // markers: true,
          trigger: $item.el,
          start: '-50% 100%',
          end: '150% 0',
          scrub: scrub
        }
      });

    });
  }
};
