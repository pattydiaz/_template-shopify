var modal = $('#modal');
var modal_wrapper = $('#modal').find('.modal-wrapper');
var modal_content = $('#modal-content');
var modal_close = $('#modal-close');
var modal_btn = $('.modal-btn');

var Modal = {
  init: function() {
    Modal.build();
  },
  build: function() {
    if(modal.is(':visible')) {

      modal_btn.each(function() {
        var $this = $(this);
        var $content = $this.next('.modal-content');

        $this
        .on('click',function(e){
          e.preventDefault();
          Modal.open($this, $content);
        })
        .on('keyup',function(e){
          if(e.key == 'Enter') modal.trigger('focus');
        });
        
      });

      modal_close.on('click',function(){
        Modal.close();
      });

      w
      .on('keyup', function(e){
        if (e.key === 'Escape') Modal.close();
      })
      .on('resize',function(){
        Modal.overflow();
      })
    }
  },
  open: function(el, content) {
    Scrolling.lock();
    Modal.overflow();

    modal.addClass('modal--open');
    body.addClass('modal-active');

    var class_name = content.attr('class');
    var class_list = class_name.split(/\s+/);

    $.grep(class_list, function (element, i) {
      if (class_name) {
        if (i === 0) return false;
        modal.addClass(element);
        return true;
      }
    });

    content.addClass('modal-content--empty').find('> div').appendTo(modal_content);

    setTimeout(() => {
      modal.trigger('focus');
    }, 100);
    
  },
  close: function() {
    Scrolling.unlock();

    setTimeout(() => {
      modal.attr('class','modal');
      modal.one('transitionend webkitTransitionEnd oTransitionEnd', function(){
        body.removeClass('modal-active');

        modal_content.find('> div').appendTo('.modal-content--empty');
        $('.modal-content--empty').removeClass('modal-content--empty');

        modal_content.empty();
      });
    }, 350);
  },
  overflow: function () {
    var mh = $(".modal-container")[0].scrollHeight;
    mh > wh ? modal.addClass("modal--scroll") : modal.removeClass("modal--scroll");
  },
}