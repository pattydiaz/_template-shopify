var Parallax = {
  init: function() {
    Parallax.build();
  },
  build: function() {
    Parallax.animate();
  },
  animate: function() {
    var parallax = $('.parallax');

    parallax.each(function(){
      var $this = $(this);
      var item = $this.hasClass('parallax-item') ? $this : $this.find('.parallax-item');

      // options
      var percent = $this.data('percent') ? $this.data('percent') : 20;
      var scrub = $this.data('scrub') ? $this.data('scrub') : true;
      var offset = $this.data('offset') ? $this.data('offset') : 0;

      gsap.set(item,{
        yPercent: $this.hasClass('no-offset') ? offset : percent
      });

      gsap.to(item, {
        yPercent: percent * -1,
        ease: 'none',
        scrollTrigger: {
          // markers: true,
          trigger: item,
          start: '-50% 100%',
          end: '100% 0',
          scrub: scrub
        }
      });
    });
  }
};