var loader = $('#loader');

var Loader = {
  init: function() {
    Loader.build();
  },
  build: function() {
    loader.is(':visible') ? Loader.primary() : Loader.fallback();
  },
  primary: function(){
    Scrolling.lock();
    
    var loader_anim = gsap.timeline();
  },
  fallback: function() {
    Scrolling.lock();
    Loader.animate();
  },
  animate: function(delay) {
    var time = delay !== undefined ? delay : 0;

    setTimeout(() => {

      lazyload = new LazyLoad(lazyloadSettings);
      body.addClass('loaded');
      Scrolling.init();
      Scrolling.unlock();
      
    }, time);
  }
};