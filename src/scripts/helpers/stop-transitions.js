/**
 * 
 * Disable transitions on resize
 * https://tinyurl.com/2da279hk
 * 
 */ 

(function() { 
  const classes = document.body.classList;
  let timer = 0;
  window.addEventListener('resize', function () {
      if (timer) {
          clearTimeout(timer);
          timer = null;
      }
      else
          classes.add('stop-transitions');

      timer = setTimeout(() => {
          classes.remove('stop-transitions');
          timer = null;
      }, 100);
  });
})();