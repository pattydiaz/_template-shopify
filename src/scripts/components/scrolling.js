var Scrolling = {
  init: function() {
    Scrolling.build();
  },
  build: function() {
    Scrolling.animate();
    Scrolling.fix();
  },
  animate: function() {
    var animated = $('.animated');

    animated.each(function(){
      var $this = $(this);
      var delay = $this.data('delay') !== undefined ? $this.data('delay') : 0;
      var offset = $this.data('offset') !== undefined ? $this.data('offset') : 0;

      ScrollTrigger.create({
        // markers: true,
        trigger: $this,
        start: offset+' 60%',
        end: "+="+$this.outerHeight(),
        onEnter: () => {
          $this.hasClass('animated-reverse') 
            ? setTimeout(() => { $this.addClass('active-reverse'); }, delay)
            : setTimeout(() => { $this.addClass('active'); }, delay);
        },
        onLeaveBack: () => {
          if($this.hasClass('animated-reverse'))
            setTimeout(() => { $this.removeClass('active-reverse'); }, delay);
        }
      });
    });
  },
  lock: function(delay) {
    var timeout = delay;
    if(timeout == undefined) timeout = 0;

    setTimeout(() => {
      $('html, body').css('overflow','hidden');
    }, timeout);
  },
  unlock: function() {
    $('html, body').css('overflow','');
  },
  fix: function() {
    if (!navigator.userAgent.match(/(Android)/)) {
      $("body *").filter(function () {
        if ($(this).css("overflow") == "scroll" || $(this).css("overflow-x") == "scroll" || $(this).css("overflow-y") == "scroll" || $(this).css("overflow") == "overlay" || $(this).css("overflow-x") == "overlay" || $(this).css("overflow-y") == "overlay") {
          $(this).attr("style", "-webkit-overflow-scrolling: touch !important;");
        }
      });
    }
  }
};