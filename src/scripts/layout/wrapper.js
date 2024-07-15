var Wrapper = {
  init: function() {
    Wrapper.build();
  },
  build: function() {
    Wrapper.height();

    w.on('resize',function(){
      Wrapper.height();
    });
  },
  height: function(){
    if(wrapper.is(':visible')) {
      
      wrapper.css('min-height','')
      wrapper.attr("data-height", wrapper.innerHeight());
  
      var nh = (wh - $('footer').innerHeight());
      if (wh > wrapper.data('height')) wrapper.css('min-height', nh);
    }
  }
};