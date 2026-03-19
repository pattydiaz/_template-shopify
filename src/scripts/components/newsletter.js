const Newsletter = {
  init() {
    this.build();
  },

  build() {
    $$('.newsletter').forEach(formEl => this.form($(formEl)));
  },

  form(el) {
    if (!el.isVisible()) return;

    const recaptchaKey = el.el.dataset.recaptchaKey || null;

    ajaxChimp(el.el, {
      language: 'en',
      recaptchaSiteKey: recaptchaKey,
      callback: resp => {
        if (resp.result === 'success') {
          const successMsg = el.next();
          if (successMsg.el && successMsg.el.classList.contains('newsletter-success')) {
            successMsg.removeClass('d-none');
          }
          el.el.remove();
        }
      }
    });
  }
};
