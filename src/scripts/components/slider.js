var Slider = {
  init() {
    this.build();
  },

  build() {
    this.default();
    this.thumbs();
    this.mobile();
  },

  default() {

    const toCamel = str =>
      str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    const getData = (el, key, fallback) => {
      const camelKey = toCamel(key);
      return el.dataset[camelKey] !== undefined
        ? el.dataset[camelKey]
        : fallback;
    };

    for (const root of $$('.slider-default')) {

      const swiperEl = root.querySelector('.swiper');
      if (!swiperEl || swiperEl.classList.contains('swiper-initialized')) continue;

      const loop = getData(swiperEl, 'loop', false);
      const effect = swiperEl.classList.contains('fade') ? 'fade' : 'slide';
      const rate = parseInt(getData(swiperEl, 'rate', 500));
      const center = getData(swiperEl, 'center', false) === "true";
      const center_all = getData(swiperEl, 'center-all', false) === "true";

      const slides_sm = parseFloat(getData(swiperEl, 'slides-sm', 1));
      const slides_md = parseFloat(getData(swiperEl, 'slides-md', slides_sm));
      const slides_lg = parseFloat(getData(swiperEl, 'slides-lg', slides_md));
      const slides_xl = parseFloat(getData(swiperEl, 'slides-xl', slides_lg));

      const group_sm = parseFloat(getData(swiperEl, 'group-sm', 1));
      const group_md = parseFloat(getData(swiperEl, 'group-md', group_sm));
      const group_lg = parseFloat(getData(swiperEl, 'group-lg', group_md));
      const group_xl = parseFloat(getData(swiperEl, 'group-xl', group_lg));

      const spacing_sm = parseFloat(getData(swiperEl, 'spacing-sm', 0));
      const spacing_md = parseFloat(getData(swiperEl, 'spacing-md', spacing_sm));
      const spacing_lg = parseFloat(getData(swiperEl, 'spacing-lg', spacing_md));
      const spacing_xl = parseFloat(getData(swiperEl, 'spacing-xl', spacing_lg));

      const paginationEl = root.querySelector('.swiper-fraction, .swiper-pagination');
      const isFraction = paginationEl?.classList.contains('swiper-fraction');
      const isDynamic = paginationEl?.classList.contains('swiper-pagination--dynamic');

      const slider = new Swiper(swiperEl, {
        loop,
        effect,
        speed: rate,
        watchOverflow: true,
        grabCursor: true,
        centeredSlides: center_all,
        centerInsufficientSlides: center,
        autoplay: swiperEl.classList.contains('autoplay') ? { delay: 8000 } : false,

        pagination: {
          el: paginationEl,
          clickable: !isFraction,
          type: isFraction ? 'fraction' : 'bullets',
          dynamicBullets: isDynamic ? true : false,
          dynamicMainBullets: 1,
        },

        navigation: {
          nextEl: root.querySelector('.slider-next'),
          prevEl: root.querySelector('.slider-prev'),
        },

        breakpoints: {
          0: { slidesPerView: slides_sm, slidesPerGroup: group_sm, spaceBetween: spacing_sm },
          768: { slidesPerView: slides_md, slidesPerGroup: group_md, spaceBetween: spacing_md },
          992: { slidesPerView: slides_lg, slidesPerGroup: group_lg, spaceBetween: spacing_lg },
          1800: { slidesPerView: slides_xl, slidesPerGroup: group_xl, spaceBetween: spacing_xl },
        },

        on: {
          init() {
            const thumbs = root.querySelectorAll('.slider-thumbs .thumb');

            if (thumbs.length) {
              thumbs.forEach(t => t.classList.remove('active'));
              root.querySelector(`.thumb[data-slide="${this.activeIndex}"]`)
                ?.classList.add('active');

              thumbs.forEach(t =>
                t.addEventListener('click', () =>
                  slider.slideTo(parseInt(t.dataset.slide), rate)
                )
              );
            }

            activeSlides(this);
          },

          slideChange() {
            if (swiperEl.querySelector('img') && window.lazyload) lazyload.update();

            swiperEl.classList.toggle('swiper--active', this.activeIndex > 0);

            const thumbs = root.querySelectorAll('.slider-thumbs .thumb');
            if (thumbs.length) {
              thumbs.forEach(t => t.classList.remove('active'));
              root.querySelector(`.thumb[data-slide="${this.activeIndex}"]`)
                ?.classList.add('active');
            }
          },

          update() { activeSlides(this); }
        }
      });

      function activeSlides(swiper) {
        const wrapper = swiper.wrapperEl;
        const slidesWidth = wrapper.scrollWidth;
        const swiperWidth = swiperEl.offsetWidth;

        root.classList.toggle('slider--active', slidesWidth <= swiperWidth);
      }
    }
  },

  thumbs() {

    const getData = (el, key, fallback) =>
      el.dataset[key] !== undefined ? el.dataset[key] : fallback;

    for (const root of $$('.slider-thumbs')) {

      const swiperEl = root.querySelector('.swiper.swiper-slides');
      const thumbsEl = root.querySelector('.swiper.swiper-thumbs');

      if (!swiperEl || !thumbsEl) continue;
      if (swiperEl.classList.contains('swiper-initialized') ||
        thumbsEl.classList.contains('swiper-initialized')) continue;

      const swiperSpacing = parseInt(getData(swiperEl, 'spacing', 15));
      const swiperRate = parseInt(getData(swiperEl, 'rate', 500));
      const thumbsSpacing = parseInt(getData(thumbsEl, 'spacing', 10));
      const thumbsSlides = parseInt(getData(thumbsEl, 'slidesSm', 5));

      const sliderThumbs = new Swiper(thumbsEl, {
        spaceBetween: thumbsSpacing,
        slidesPerView: thumbsSlides,
        freeMode: true,
        watchSlidesProgress: true,
        grabCursor: true
      });

      new Swiper(swiperEl, {
        spaceBetween: swiperSpacing,
        speed: swiperRate,
        grabCursor: true,
        autoplay: swiperEl.classList.contains('autoplay') ? { delay: 8000 } : false,

        navigation: {
          nextEl: root.querySelector('.slider-next'),
          prevEl: root.querySelector('.slider-prev'),
        },

        thumbs: { swiper: sliderThumbs },

        on: {
          slideChange() {
            if (swiperEl.querySelector('img') && window.lazyload) lazyload.update();
          }
        }
      });
    }
  },

  mobile() {

    const getData = (el, key, fallback) =>
      el.dataset[key] !== undefined ? el.dataset[key] : fallback;

    for (const root of $$('.slider-mobile')) {

      let isActive = false;
      let slider;

      const swiperEl = root.querySelector('.swiper');
      if (!swiperEl) continue;

      const loop = getData(swiperEl, 'loop', false);
      const effect = swiperEl.classList.contains('fade') ? 'fade' : 'slide';
      const rate = parseInt(getData(swiperEl, 'rate', 500));
      const center = getData(swiperEl, 'center', false) === "true";

      const slides = parseInt(getData(swiperEl, 'slides', 1));
      const group = parseInt(getData(swiperEl, 'group', 1));
      const spacing = parseInt(getData(swiperEl, 'spacing', 0));

      const nextBtn = root.querySelector('.slider-next');
      const prevBtn = root.querySelector('.slider-prev');

      const paginationEl = root.querySelector('.swiper-fraction, .swiper-pagination');
      const isFraction = paginationEl?.classList.contains('swiper-fraction');
      const isDynamic = paginationEl?.classList.contains('swiper-pagination--dynamic');

      const sliderOptions = {
        init: false,
        loop,
        effect,
        speed: rate,
        watchOverflow: true,
        centerInsufficientSlides: center,
        slidesPerView: slides,
        slidesPerGroup: group,
        spaceBetween: spacing,

        autoplay: swiperEl.classList.contains('autoplay') ? { delay: 8000 } : false,

        pagination: {
          el: paginationEl,
          clickable: !isFraction,
          type: isFraction ? 'fraction' : 'bullets',
          dynamicBullets: isDynamic ? true : false,
          dynamicMainBullets: 1,
        },

        navigation: { nextEl: nextBtn, prevEl: prevBtn },

        on: {
          init() { isActive = true; activeSlides(this); },

          slideChange() {
            if (swiperEl.querySelector('img') && window.lazyload) lazyload.update();
          },

          resize() { activeSlides(this); },
          update() { activeSlides(this); }
        }
      };

      function activeSlides(swiper) {
        const wrapper = swiper.wrapperEl;
        const areActive = wrapper.scrollWidth <= swiperEl.offsetWidth;
        root.classList.toggle('slider--active', areActive);
      }

      function updateSlider() {
        const ww = window.innerWidth;

        if (ww < 768 && !isActive) {
          slider = new Swiper(swiperEl, sliderOptions);
          slider.init();
        }

        if (ww >= 768 && isActive) {
          slider.destroy();
          isActive = false;
          root.classList.remove('slider--active');
        }
      }

      updateSlider();
      window.addEventListener('resize', updateSlider);
    }
  }
};
