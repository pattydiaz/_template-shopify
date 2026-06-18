// Short debug helpers (optional)
const cl = (...args) => console.log(...args);
const rtn = e => e;

// Keep $$ for NodeLists
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Cached DOM references
const w = $(window);
let ww = window.innerWidth;
let wh = window.innerHeight;
const doc = $(document);
const html = $(document.documentElement);
const body = $(document.body);

// Query elements
const page = $('#page');
const main = $('#main');
const wrapper = $('#wrapper');
const loader = $('#loader');
const header = $('.header');
const footer = $('.footer');
const announcement = $('.announcement');
let loaded = false;

const isShopifyEditor = window.Shopify && Shopify.designMode;

gsap.registerPlugin(ScrollTrigger);

// Lazyload config
let lazyload;
const lazyloadSettings = {
  thresholds: '0px 100px',
  threshold: 0.1,
  rootMargin: '50px 0px',
  elements_selector: '.lazy',
  load_delay: 0,
  callback_loaded: el => {
    el.classList.add('loaded');

    if (el.tagName === 'VIDEO') {
      el.muted = true;
      el.load();

      if (el.hasAttribute('autoplay')) {
        el.play().catch(() => {});
      }
    }
  },
  callback_error: el => {
    if (el.tagName === 'VIDEO') return;

    el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4=';
  }
};

buddySystem(document.getElementsByClassName('buddy'));

$$("a, button").forEach(el =>
  el.addEventListener("mouseup", () => el.blur(), { passive: true })
);

let resizeScheduled = false;
window.addEventListener('resize', () => {
  if (resizeScheduled) return;
  resizeScheduled = true;

  requestAnimationFrame(() => (
    ww = window.innerWidth, 
    wh = window.innerHeight, 
    resizeScheduled = false
  ));
}, { passive: true });