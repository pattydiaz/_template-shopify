var Project = {
  init() {
    loaded = true;
    Scrolling.top();
    Page.init();
    Project.build();
  },

  build() {
    Buttons.init();
    Parallax.init();
    Accordion.init();
    Slider.init();
    // Newsletter.init();
    Header.init();
    Navigation.init();
    // Modal.init();
    Products.init();
    Product.init();
    Drawer.init();
    CartAdd.init();
  },

  reinit() {
    lazyload.update();
    Cart.init();
    Drawer.init();
    CartAdd.init();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Project.init();
});

document.addEventListener('shopify:section:load', () => {
  Project.reinit();
});