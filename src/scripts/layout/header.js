var header = $(".header");

var Header = {
  init: function () {
    Header.build();
  },
  build: function () {
    if (header.is(":visible")) {
      Header.height();
      Header.scroll();
    }
  },
  height: function () {
    var hh = header.outerHeight();
    body.get(0).style.setProperty("--hh", hh + "px");

    w.on("resize", function () {
      hh = header.outerHeight();
      body.get(0).style.setProperty("--hh", hh + "px");
    });
  },
  scroll: function () {

    var header_anim = gsap.timeline({
      paused: true,
      scrollTrigger: {
        // markers: true,
        trigger: body,
        start: '0 0',
        end: '100% 0',
        onUpdate: (self) => {
          self.progress > 0.01 
            ? header.addClass("header--scroll") 
            : header.removeClass("header--scroll");

          if (self.progress > 0.01 && self.direction == 1 && !body.hasClass("nav-active"))
            header_anim.play();

          if (self.direction == -1 && !body.hasClass("nav-active"))
            header_anim.reverse();
        }
      },
    });

    header_anim.to(header, {
      y: '-100%',
      duration: 0.2,
      ease: 'power2.inOut'
    });

  },
};
