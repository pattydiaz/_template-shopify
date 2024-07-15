var nav = $('.nav');
var menu_btn = $('#hamburger');

var Navigation = {
  init: function() {
    Navigation.build()
  },
  build: function() {
    if(nav.is(':visible')) {

      Navigation.overflow();
      
      menu_btn.on('click',function() {
        $(this).toggleClass('active');
        ($(this).hasClass('active')) ? Navigation.open() : Navigation.close();
      });

      w
      .on('keyup', function(e){
        if(nav.hasClass('nav--open')) {
          if (e.key === 'Escape') Navigation.close();
        }
      })
      .on('resize',function(){
        Navigation.overflow();
      });

    }
  },
  open: function() {
    Scrolling.lock();

    menu_btn.attr('aria-label','Close');
    menu_btn.addClass('active');
    
    nav.addClass('nav--open');
    body.addClass('nav-open');
    body.addClass('nav-active');

    nav.find('.nav--animate').each(function (i) {
      $(this).delay(500 * i).queue(function () {
        $(this).addClass('active').dequeue();
      });
    });
  },
  close: function() {
    Scrolling.unlock();
    menu_btn.attr('aria-label','Menu');
    menu_btn.removeClass('active');
    
    nav.find('.nav--animate').removeClass('active');
    
    setTimeout(() => {
      nav.removeClass('nav--open');
      body.removeClass('nav-open');
      
      setTimeout(() => {
        body.removeClass('nav-active');
      }, 600);
      
    }, 300);

  },
  overflow: function() {
    var sh = nav.find('.nav-container')[0].scrollHeight;
    var nh = sh + header.outerHeight();

    nh > wh ? nav.addClass('nav--scroll') : nav.removeClass('nav--scroll');
  }
}