/**
 * 
 * Detect Touch Screen
 * https://tinyurl.com/ak5ypuhh
 * 
 */ 

var isMobile = ('ontouchstart' in document.documentElement);

if(isMobile) {
  document.body.classList.add("mobile");
} else {
  document.body.classList.remove("mobile");
}