const Scrolling = {
  init() {
    this.build();
  },

  build() {
    this.animate();
    this.hash();
    this.fix();
  },

  scrollTo(targetEl, duration = 1) {
    if (!targetEl) return;

    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const startY = window.scrollY;
    const endY = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

    gsap.to({ y: startY }, {
      y: endY,
      duration,
      ease: 'power1.inOut',
      onUpdate() {
        window.scrollTo(0, this.targets()[0].y);
      }
    });
  },

  animate() {
    $$('.animated').forEach(el => {
      const $el = $(el);

      const delay = parseInt($el.attr('data-delay')) || 0;
      const offset = $el.attr('data-offset') || 0;
      const isReverse = el.classList.contains('animated-reverse');
      const height = el.offsetHeight;

      let enterTimeout, leaveTimeout;

      ScrollTrigger.create({
        trigger: el,
        start: `${offset} 60%`,
        end: `+=${height}`,

        onEnter: () => {
          enterTimeout = setTimeout(() => {
            $el.addClass(isReverse ? 'active-reverse' : 'active');
          }, delay);
        },

        onLeaveBack: () => {
          if (isReverse) {
            if (enterTimeout) clearTimeout(enterTimeout);
            leaveTimeout = setTimeout(() => {
              $el.removeClass('active-reverse');
            }, delay);
          }
        }
      });
    });
  },

  hash() {
    const anchor = window.location.hash;
    if (!anchor) return;

    const $target = $(anchor);
    if ($target.el) {
      requestAnimationFrame(() => {
        this.scrollTo($target.el, 1);
      });
    }
  },

  lock() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  },

  unlock() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  },

  top() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('load', () => {
      window.scrollTo(0, 0)
      ScrollTrigger.refresh(true);
    });
  },

  fix() {
    if (/Android/.test(navigator.userAgent)) return;

    $$('[style*="overflow"], [style*="scroll"], [style*="overlay"]').forEach(el => {
      const style = getComputedStyle(el);
      const overflow = style.overflow + style.overflowX + style.overflowY;

      if (/(scroll|overlay)/.test(overflow)) {
        el.style.webkitOverflowScrolling = 'touch';
      }
    });
  }
};