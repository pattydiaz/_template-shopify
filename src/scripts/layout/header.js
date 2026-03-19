const header_wrapper = header.find('.header-wrapper');
let header_anim;
let header_height;
let announcement_height = 0;

const Header = {
  init() {
    this.build();
  },

  build() {
    if (header.isVisible()) {
      this.height();
      this.scroll();
      this.cart();
    }
  },

  height() {
    header_height = header.el.offsetHeight;
    body.el.style.setProperty("--hh", `${header_height}px`);

    if (announcement.isVisible()) {
      announcement_height = announcement.el.offsetHeight;
      body.el.style.setProperty("--ah", `${announcement_height}px`);
    } else {
      announcement_height = 0;
      body.el.style.setProperty("--ah", `0px`);
    }

    w.on("resize", () => {
      header_height = header.el.offsetHeight;
      body.el.style.setProperty("--hh", `${header_height}px`);

      if (announcement.isVisible()) {
        announcement_height = announcement.el.offsetHeight;
        body.el.style.setProperty("--ah", `${announcement_height}px`);
      } else {
        announcement_height = 0;
        body.el.style.setProperty("--ah", `0px`);
      }

      // ScrollTrigger.refresh();
    });
  },

  scroll() {
    header_anim = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: body.el,
        start: "0 0",
        end: "100% 0",
        // markers: true,

        onUpdate: self => {
          const scrolledPastHeader = self.scroll() > header_height;
          const scrollingDown = scrolledPastHeader && self.direction === 1;
          const scrollingUp = self.direction === -1;

          const navActive = body.el.classList.contains("nav-active");
          const sidecartActive = body.el.classList.contains("sidecart-active");

          if (self.progress > 0.01) {
            header.el.classList.add("header--scroll");
          } else {
            header.el.classList.remove("header--scroll");
          }

          if (scrollingDown && !navActive && !sidecartActive) {
            header_anim.play();
          }

          if (scrollingUp || sidecartActive) {
            header_anim.reverse();
          }
        }
      }
    });

    if(!header_wrapper.el.classList.contains("header--fixed")) {

      header_anim.to(header_wrapper.el, {
        y: "-150%",
        duration: 0.3,
        ease: "power2.inOut"
      });
      
    }

  },

  cart() {
    const btn = $('#cart-btn');
    if (!btn.el) return;

    btn.on('click', e => {
      e.preventDefault();
      Drawer.open();
    });
  },
};
