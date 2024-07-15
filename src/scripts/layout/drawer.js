var drawer = $('.drawer');

var Drawer = {
  init: function() {
    Drawer.build();
  },
  build: function() {
    if(drawer.is(':visible')) {
      
      Drawer.listeners();

      document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          $(e.submitter).addClass('loading');

          await fetch(window.Shopify.routes.root + 'cart/add', {
            method: 'post',
            body: new FormData(form)
          });

          const res = await fetch("/cart.js");
          const cart = await res.json();
          Drawer.count(cart.item_count);

          await Drawer.update();
          setTimeout(() => {
            Drawer.open();
            $(e.submitter).removeClass('loading');
          }, 10);

        });
      });

      $('a[href="/cart"]:not(.drawer a[href="/cart"])').each(function(){
        $(this).on('click',function(e){
          e.preventDefault();
          Drawer.open();
        })
      })

    }
  },
  open: function() {
    Scrolling.lock();
    drawer.addClass('drawer--active').addClass('drawer--animate');
  },
  close: function() {
    Scrolling.unlock();
    $(document).find('.drawer').removeClass('drawer--animate');
    setTimeout(() => {
      $(document).find('.drawer').removeClass('drawer--active');
    }, 200);
  },
  count: function(count) {
    $('.count').each(function(){
      $(this).text(count)
      count == 0 ? $(this).addClass('count--hide') : $(this).removeClass('count--hide');
    })
  },
  update: async function() {
    const res = await fetch("/?div_id=drawer");
    const text = await res.text();
    const html = document.createElement("div");
    html.innerHTML = text;

    const newBox = html.querySelector(".drawer").innerHTML;
    document.querySelector(".drawer").innerHTML = newBox;

    Drawer.listeners();
  },
  listeners: function() {

    document.querySelectorAll('.drawer input[type="number"]').forEach((el) => {
      el.addEventListener('input', async () => {
        var item = el.parentElement.parentElement.parentElement;
        var key = item.getAttribute('data-line-item-key');
        var quantity = Number(el.value);

        const res = await fetch("/cart/update.js", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: { [key]: quantity } }),
        });
        const cart = await res.json();
    
        Drawer.count(cart.item_count);
        Drawer.update();

      });
    });

    $('.drawer-container').on('click',function(e){
      e.stopPropagation();
    });

    $('.drawer-close, .drawer').on('click',function(){
      Drawer.close();
    })
  }
}
