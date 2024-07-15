var product = $('.product');

var Product = {
  init: function() {
    Product.build();
  },
  build: function() {
    if(product.is(':visible')) {
      Product.load();
      Product.transition();
    }
  },
  load: function(el) {
    var background = el == undefined ? $('.product-wrap').data('background') : el;
    body.css('background-color', background);
  },
  transition: function() {

    $('.product-click a').on('click', function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      var handle = href.split('/')[2];

      $.ajax({
        url: `/products/${handle}?view=ajax`,
        method: 'GET',
        success: function(data) {
          $('#product').remove();
          $(data).find('#product').appendTo('.product-wrap');
          var background = $(data).find('.product-wrap').data('background');

          Project.reinit();
          window.history.replaceState(null, $(data).filter('title').text(), href);
          Product.transition();

          var swipe = $(document).find('.swipe');

          gsap.timeline({delay: 0.4})
            .to(swipe, {x: 0, duration: 0.3, ease: 'circ.inOut', onComplete:function(){ $('#product').data('background', background); Product.load(background); }})
        },
        error: function() {
          alert('Failed to load product data.');
        }
      });
    });

  },
}