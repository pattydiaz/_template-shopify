var Project = {
  init: function() {
    Buttons.init();
    Parallax.init();
    Inputs.init();
    // Video.init();
    // Slider.init();
    // Newsletter.init();
    // Accordion.init();

    Header.init();
    // Navigation.init();
    // Modal.init();
    // Consent.init();
    Drawer.init();

    Product.init();
  },
  reinit: function() {
    lazyload.update();
    Drawer.init();
  }
};



$(function() {
  
  w.on('load',function(){
    loaded = true;
    
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0,0);

    Page.init();
    Wrapper.init();
    Project.init();

  });
});