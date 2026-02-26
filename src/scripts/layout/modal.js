const modal = $('#modal');
const modal_layout = modal.find('.modal-layout');
const modal_wrapper = modal.find('.modal-wrapper');
const modal_container = modal.find('.modal-container');
const modal_content = $('#modal-content');
const modal_close = $('#modal-close');
const modal_btn = $$('.modal-btn');

const Modal = {
  
  init() {
    this.build();
  },

  build() {
    if (!modal.isVisible()) return;
    this.bindEvents();
  },

  bindEvents() {
    // open handlers (multiple buttons)
    modal_btn.forEach((btnEl) => {
      $(btnEl).on('click', (e) => {
        e.preventDefault();

        const btn = $(btnEl);
        const content = btn.next('.modal-content');

        this.open(btn, content);
      });

      $(btnEl).on('keyup', (e) => {
        if (e.key === 'Enter') modal.el?.focus();
      });
    });

    modal_close.on('click', () => this.close());

    w.on('keyup', (e) => {
      if (e.key === 'Escape') this.close();
    });

    w.on('resize', () => this.overflow());
  },

  open(el, content) {
    Scrolling.lock();
    this.overflow();

    modal.addClass('modal--open');
    body.addClass('modal-active');

    const contentEl = content?.el;

    if (contentEl) {
      // Apply all classes except the first (base) one
      const class_list = (contentEl.className || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(1);

      if (class_list.length) modal.el.classList.add(...class_list);

      // Copy data attributes
      Object.entries(contentEl.dataset || {}).forEach(([key, value]) => {
        modal_layout.el.setAttribute(`data-${key}`, value);
      });

      // Move child divs into modal_content
      contentEl.classList.add('modal-content--empty');

      const divs = Array.from(contentEl.querySelectorAll(':scope > div'));
      divs.forEach((div) => modal_content.el.appendChild(div));
    }

    setTimeout(() => modal.el?.focus(), 100);
  },

  close() {
    Scrolling.unlock();

    setTimeout(() => {
      modal.removeClass('modal--open');

      setTimeout(() => {
        body.removeClass('modal-active');

        const empty_content = document.querySelector('.modal-content--empty');

        if (empty_content) {
          const divs = Array.from(modal_content.el.querySelectorAll(':scope > div'));
          divs.forEach((div) => empty_content.appendChild(div));

          empty_content.classList.remove('modal-content--empty');
        }

        // Clear modal content
        modal_content.el.innerHTML = '';

        // Reset modal class and data
        modal.el.className = 'modal';

        Object.keys(modal_layout.el.dataset || {}).forEach((key) => {
          modal_layout.el.removeAttribute(`data-${key}`);
        });

      }, 600);

    }, 300);
  },

  overflow() {
    const mh = modal_container.el?.scrollHeight || 0;
    modal.el?.classList.toggle('modal--scroll', mh > wh);
  }
};
