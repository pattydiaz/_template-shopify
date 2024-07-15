var Accordion = {
  init: function () {
    Accordion.build();
  },
  build: function () {
    Accordion.clicks();
    Accordion.animate();
  },
  clicks: function() {
    var accordion_header = $('.accordion-header');

    accordion_header.each(function () {
      var ah = $(this);
      var ac = ah.next(".accordion-content");

      Accordion.toggle(ah, ac);

      ah.on("click", function (e) {
        e.preventDefault();

        if($('.accordion-header.active').length > 0) {

          if(ah.parents('.accordion').length > 0) {
            ah.parents('.accordion').find('.accordion-header').not(ah).removeClass('active')
            ah.parents('.accordion').find('.accordion-content').not(ac).removeClass('active').attr('style','');
          } else {
            ah.parents('.section').find('.accordion-header').not(ah).removeClass('active')
            ah.parents('.section').find('.accordion-content').not(ac).removeClass('active').attr('style','');
          }

        }

        ah.toggleClass("active");
        Accordion.toggle(ah, ac);

      });

      w.on("resize", function () {
        Accordion.toggle(ah, ac);
      });

    });
  },
  toggle: function (h, c) {
    c.attr('style','');
    var ch = c.get(0).scrollHeight;

    h.hasClass("active") 
      ? c.addClass("active").css({ height: ch }) 
      : c.removeClass("active").attr('style','');
  },
  animate: function() {
    var accordion_animated = $('.accordion-animated');

    accordion_animated.each(function(){
      var $this = $(this);
      var ah = $this.find('.accordion-header:first-of-type');
      var ac = ah.next('.accordion-content');

      ScrollTrigger.create({
        // markers: true,
        trigger: $this,
        start: '0 50%',
        onEnter: () => {
          if(!ah.siblings().hasClass('active')) {
            ah.addClass("active");
            ac.addClass("active");
            Accordion.toggle(ah, ac);
          }
        }
      });

    });
  }
};