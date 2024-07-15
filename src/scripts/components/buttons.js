var Buttons = {
  init: function () {
    Buttons.build();
  },
  build: function () {
    Buttons.anchor();
  },
  anchor: function () {
    var anchorBtn = $(".anchor");
    var anchorBtnNext = $(".anchor-next");
    
    anchorBtn.each(function () {
      var id = $(this).attr('href');
      
      $(this).on("click", function (e) {
        e.preventDefault();
        
        gsap.to(smoother,{
          scrollTop: smoother.offset($(id)[0],'0 0'),
          duration: 2,
          ease: 'back.out'
        })
      });
    });

    anchorBtnNext.each(function() {
      var id = $(this).parents('section').next();

      $(this).on("click", function (e) {
        e.preventDefault();

        gsap.to(smoother,{
          scrollTop: smoother.offset($(id)[0],'0 0'),
          duration: 2,
          ease: 'power1.inOut'
        })
      });
    })
  },
  doubleclick: function (el) {
    //if already clicked return TRUE to indicate this click is not allowed
    if (el.data("isclicked")) return true;

    //mark as clicked for 1 second
    el.data("isclicked", true);
    setTimeout(function () {
      el.removeData("isclicked");
    }, 1000);

    //return FALSE to indicate this click was allowed
    return false;
  },
  trigger: function(el) {
    setTimeout(function(){ el.trigger('click'); }, 0);
  }
};
