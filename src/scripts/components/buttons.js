const Buttons = {
  init() {
    this.build();
  },

  build() {
    this.anchor();
  },

  anchor() {
    // Smooth scroll using GSAP, wrapper-friendly
    const scrollToTarget = (targetEl) => {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const startY = window.scrollY;
      const endY = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      gsap.to({ y: startY }, {
        y: endY,
        duration: 1,
        ease: 'power1.inOut',
        onUpdate() {
          window.scrollTo(0, this.targets()[0].y);
        }
      });
    };

    // Handle anchors (#target)
    const handleAnchorClick = ($anchor, e) => {
      const id = $anchor.attr('href');
      if (!id || id === '#' || $anchor.el.classList.contains('skip-to-content')) return;

      e.preventDefault();

      const $target = $(id);
      if ($target.el) scrollToTarget($target.el);
    };

    // Handle 'next section' buttons
    const handleNextClick = ($btn, e) => {
      e.preventDefault();

      const $section = $($btn.el.closest('section'));
      const $next = $section.el ? $( $section.el.nextElementSibling ) : null;

      if ($next && $next.el) scrollToTarget($next.el);
    };

    // EVENT DELEGATION (single listener)
    document.addEventListener('click', function (e) {
      const anchorEl = e.target.closest('a[href^="#"]:not(.skip-to-content), .anchor');
      if (anchorEl) {
        return handleAnchorClick($(anchorEl), e);
      }

      const nextEl = e.target.closest('.anchor-next');
      if (nextEl) {
        return handleNextClick($(nextEl), e);
      }
    });
  },

  // Prevent double click
  doubleclick(el) {
    if (el.dataset.isclicked) return true;
    el.dataset.isclicked = true;
    setTimeout(() => delete el.dataset.isclicked, 1000);
    return false;
  },

  // Trigger element click async
  trigger(el) {
    setTimeout(() => el.click(), 0);
  }
};
