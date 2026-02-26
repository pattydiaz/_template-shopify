const accordions = $$('.accordion-panel');

const Accordion = {
  init() {
    this.build();
    this.scroll();
  },

  build() {
    this.animate();
  },

  setHeight(content, open) {
    content.el.style.maxHeight = open
      ? content.el.scrollHeight + 'px'
      : null;
  },

  open(panel, button, content, mode = 'active') {
    panel.el.classList.add(mode);
    button.el.classList.add(mode);
    content.el.classList.add(mode);
    this.setHeight(content, true);
  },

  close(panel, button, content) {
    ['open', 'active'].forEach(cls => {
      panel.el.classList.remove(cls);
      button.el.classList.remove(cls);
      content.el.classList.remove(cls);
    });

    this.setHeight(content, false);
  },

  animate() {
    accordions.forEach(panelEl => {
      const panel = $(panelEl);
      const button = panel.find('.accordion-btn');
      const content = button.next();

      if (!button.el || !content.el) return;

      const isOpen = () =>
        button.el.classList.contains('open') ||
        button.el.classList.contains('active');

      const isActive = () =>
        button.el.classList.contains('active') &&
        content.el.classList.contains('active');

      // Initial open state
      if (isOpen()) {
        panel.addClass('open');
        this.setHeight(content, true);
      }

      // Resize: keep height in sync
      w.on('resize', () => {
        if (isOpen() || isActive()) {
          this.setHeight(content, true);
        }
      });

      // Click toggle
      button.on('click', () => {
        if (isOpen()) {
          this.close(panel, button, content);
        } else {
          this.open(panel, button, content, 'active');
        }
      });

    });
  },

  scroll() {
    if (body.el && body.el.classList.contains('mobile')) return;
    
    const animatedAccordions = $$('.accordion-animated');

    animatedAccordions.forEach(acc => {
      if (!$(acc).isVisible()) return;

      const firstButton = acc.querySelector('.accordion-btn');
      if (!firstButton) return;

      const firstContent = firstButton.nextElementSibling;
      if (!firstContent) return;

      ScrollTrigger.create({
        trigger: acc,
        start: 'top 50%',
        once: true,

        onEnter: () => {
          // Respect user interaction
          if (acc.querySelector('.accordion-btn.active')) return;

          const panel = $(firstButton).closest('.accordion-panel');

          this.open( panel, $(firstButton), $(firstContent), 'active');
        }
      });
    });
  }
};
