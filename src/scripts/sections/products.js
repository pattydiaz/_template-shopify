const Products = {
  els: {},

  init() {
    this.build();
  },

  build() {
    this.els.wrapper = $('.products');
    if (!this.els.wrapper.isVisible()) return;

    this.cache();
    this.bindNav();
    this.bindLoadMore();
    this.bindPopState();
  },

  cache() {
    this.els.results = $('#products-results');
    this.els.nav = $('#products-nav');
  },

  bindNav() {
    if (!this.els.nav.el) return;

    this.els.nav.el.querySelectorAll('a').forEach(link => {
      $(link).on('click', e => this.onNavClick(e, link));
    });
  },

  bindLoadMore() {
    const btn = $('#loadmore');
    if (!btn.el) return;

    btn.on('click', () => this.onLoadMore(btn));
  },

  bindPopState() {
    window.addEventListener('popstate', () => {
      this.fetchAndSwap(location.href);
    });
  },

  onNavClick(e, link) {
    e.preventDefault();

    const href = link.getAttribute('href');
    if (!href) return;

    this.updateNavUI($(link));
    history.pushState({}, '', href);

    this.fetchAndSwap(href);
  },

  updateNavUI(activeLink) {
    this.els.nav.el
      .querySelectorAll('a')
      .forEach(a => a.classList.remove('active'));

    activeLink.addClass('active');
  },

  async fetchAndParse(url) {
    const res = await fetch(url, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });

    if (!res.ok) throw new Error('Fetch failed');

    const html = await res.text();
    return new DOMParser().parseFromString(html, 'text/html');
  },

  async fetchAndSwap(url) {
    try {
      const doc = await this.fetchAndParse(url);
      this.animateSwap(doc);
    } catch {
      window.location.href = url;
    }
  },

  animateSwap(doc) {
    const newResults = doc.querySelector('#products-results');
    const currentResults = this.els.results.el;

    if (!newResults || !currentResults) return;

    gsap.timeline()
      .to(currentResults, {
        opacity: 0,
        duration: 0.25
      })
      .add(() => {
        currentResults.replaceWith(newResults);
        this.cache();        // re-cache replaced DOM
        this.bindLoadMore(); // re-bind new load more button
      })
      .to(this.els.results.el, {
        opacity: 1,
        duration: 0.25,
        onComplete: () => {
          lazyload?.update?.();
        }
      });
  },

  async onLoadMore(btn) {
    const totalPages = parseInt($('[data-all-pages]').el.value, 10);
    let currentPage = parseInt($('[data-this-page]').el.value, 10);
    const nextLink = $('[data-next-link]');
    if (!nextLink.el) return;

    btn.el.disabled = true;

    try {
      const doc = await this.fetchAndParse(nextLink.el.value);
      const newResults = doc.querySelector('#products-results');
      if (!newResults) return;

      // append new products
      const newItems = newResults.querySelector('ul')?.innerHTML;
      if (newItems) {
        this.els.results.find('ul').el.insertAdjacentHTML('beforeend', newItems);
      }

      // increment current page
      currentPage++;
      $('[data-this-page]').el.value = currentPage;

      // hide load more if we reached the end
      if (currentPage >= totalPages) {
        $('#loadmore').addClass('d-none');
      } else {
        // replace pagination UI if needed
        const newPagination = newResults.querySelector('.loadmore');
        const oldPagination = this.els.results.find('.loadmore');
        if (newPagination && oldPagination.el) {
          oldPagination.el.replaceWith(newPagination);
          this.bindLoadMore(); // rebind new button if present
        }
      }

      lazyload?.update?.();

    } catch {
      window.location.href = nextLink.el.value;
    } finally {
      btn.el.disabled = false;
    }
  }
};
