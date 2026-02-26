const nav = $('#nav');
const menu_btn = $('#menu');

const Navigation = {
  
  init() {
    this.build();
  },

  build() {
    if (nav.isVisible()) {

      menu_btn.on('click', () => {
        const isActive = menu_btn.el.classList.toggle('active');
        isActive ? this.open() : this.close();
      });

      w.on('keyup', (e) => {
        if (nav.el.classList.contains('nav--open') && e.key === 'Escape') {
          this.close();
        }
      });
    }
  },

  open() {
    Scrolling.lock();

    menu_btn.el.textContent = 'Close';
    menu_btn.el.setAttribute('aria-label', 'Close');
    menu_btn.addClass('active');

    nav.addClass('nav--open');
    body.addClass('nav-open');
    body.addClass('nav-active');

    setTimeout(() => {
      nav.el.focus();
    }, 100);

    const items = nav.el.querySelectorAll('.nav--animate');
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('active'), 500 * i);
    });
  },

  close() {
    Scrolling.unlock();
    
    menu_btn.el.textContent = 'Menu';
    menu_btn.el.setAttribute('aria-label', 'Menu');
    menu_btn.removeClass('active');

    const items = nav.el.querySelectorAll('.nav--animate');
    items.forEach(item => item.classList.remove('active'));

    nav.removeClass('nav--open');
    body.removeClass('nav-open');

    setTimeout(() => {
      body.removeClass('nav-active');
    }, 420);
  }
};
