var Page = {
  init: function() {
    Page.build();
  },
  build: function() {
    if(page.is(':visible')) {
      Page.height();
      Page.animate();
    }
  },
  height: function() {
    var vh = w.innerHeight() * 0.01;
    body.get(0).style.setProperty("--vh", vh + "px");
    
    w.on("resize", function () {
      vh = w.innerHeight() * 0.01;
      body.get(0).style.setProperty("--vh", vh + "px");
    });
  },
  animate: function() {
    // page.css('opacity', 1);
    // Loader.init();

    var page_anim = gsap.timeline();
    page_anim.to(page, {opacity: 1, duration: 0.0001, onStart:function(){ Loader.init(); }})
  }
};