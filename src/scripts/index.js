function cl(e) {
  console.log(e);
}

function rtn(e) {
  return e;
}

var w = $(window)
var ww = w.width();
var wh = w.height();
var doc = $(document);
var html = $('html');
var body = $('body');
var page = $('#page');
var main = $('#main');
var wrapper = $('#wrapper');
var footer = $('footer');
var loaded = false;

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

var smoother = ScrollSmoother.create({
  wrapper: '#page',
  content: '#main',
  smooth: 0.8,
  smoothTouch: 0.08,
  effects: true,
});

var lazyload;
var lazyloadSettings = {
  thresholds: '50% 0px'
}

$('.buddy').buddySystem();

$("a, button").on("mouseup", function () {
  $(this).trigger('blur');
});

w.on('resize',function(){
  ww = w.width();
  wh = w.height();
});