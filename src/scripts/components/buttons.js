const Buttons = {
  init() {
    this.build();
  },

  build() {
    this.anchor();
  },

  anchor() {
    
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

    const handleAnchorClick = ($anchor, e) => {
      const href = $anchor.attr('href');
      if (!href || href === '#' || $anchor.el.classList.contains('skip-to-content')) return;

      const isHashLink = href.startsWith('#');
      const isHomeHashLink = href.startsWith('/#');

      if (!isHashLink && !isHomeHashLink) return;
      if (isHomeHashLink && window.location.pathname !== '/') return;

      e.preventDefault();

      const $target = $(isHomeHashLink ? href.slice(1) : href);
      if ($target.el) scrollToTarget($target.el);

      // if ($('body').el.classList.contains('nav-open')) {
      //   Navigation.close();
      // }
    };

    const handleNextClick = ($btn, e) => {
      e.preventDefault();

      const $section = $($btn.el.closest('section'));
      const $next = $section.el ? $( $section.el.nextElementSibling ) : null;

      if ($next && $next.el) scrollToTarget($next.el);
    };

    document.addEventListener('click', function (e) {
      const anchorEl = e.target.closest('a[href^="#"]:not(.skip-to-content), a[href^="/#"], .anchor');
      if (anchorEl) {
        return handleAnchorClick($(anchorEl), e);
      }

      const nextEl = e.target.closest('.anchor-next');
      if (nextEl) {
        return handleNextClick($(nextEl), e);
      }
    });
  },

  doubleclick(el) {
    if (el.dataset.isclicked) return true;
    el.dataset.isclicked = true;
    setTimeout(() => delete el.dataset.isclicked, 1000);
    return false;
  },

  trigger(el) {
    setTimeout(() => el.click(), 0);
  }
};
