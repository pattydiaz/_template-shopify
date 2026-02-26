/**
 * 
 * Mailchimp AJAX Vanilla JS
 * 
 */ 

class MailchimpAjax {
  static responses = {
    'We have sent you a confirmation email': 0,
    'Please enter a value': 1,
    'An email address must contain a single @': 2,
    'The domain portion of the email address is invalid (the portion after the @: )': 3,
    'The username portion of the email address is invalid (the portion before the @: )': 4,
    'This email address looks fake or invalid. Please enter a real email address': 5
  };

  static translations = { en: null };

  constructor(form, options = {}) {
    this.form = form;
    this.email = form.querySelector('input[type=email]');
    if (!this.email) throw new Error('Form must contain an <input type=email>');
    this.label = form.querySelector(`label[for="${this.email.id}"]`);
    if (!this.label) throw new Error('Form must contain a <label for=emailInputId>');

    this.settings = Object.assign(
      { url: form.action, language: 'en', callback: null },
      options
    );

    this.jsonpUrl = this.settings.url.replace('/post?', '/post-json?') + '&c=callback';
    this.init();
  }

  init() {
    this.form.setAttribute('novalidate', 'true');
    this.email.setAttribute('name', 'EMAIL');

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }

  submit() {
    let msg = 'Submitting...';
    const lang = this.settings.language;

    if (
      lang !== 'en' &&
      MailchimpAjax.translations[lang] &&
      MailchimpAjax.translations[lang]['submit']
    ) {
      msg = MailchimpAjax.translations[lang]['submit'];
    }

    this.label.textContent = msg;
    this.label.style.display = 'block';

    // Collect form data
    const data = {};
    new FormData(this.form).forEach((value, key) => (data[key] = value));

    this.callJsonp(data);
  }

  callJsonp(data) {
    const script = document.createElement('script');
    const callbackName = 'mailchimp_callback_' + Math.random().toString(36).substr(2);

    window[callbackName] = resp => {
      delete window[callbackName];
      script.remove();
      this.handleResponse(resp);
    };

    const query = Object.keys(data)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

    script.src = this.jsonpUrl.replace('callback', callbackName) + '&' + query;
    document.body.appendChild(script);
  }

  handleResponse(resp) {
    let msg;
    let index = -1;

    if (resp.result === 'success') {
      msg = 'We have sent you a confirmation email';
      this.label.classList.remove('error');
      this.label.classList.add('valid');
      this.email.classList.remove('error');
      this.email.classList.add('valid');
    } else {
      this.email.classList.remove('valid');
      this.email.classList.add('error');
      this.label.classList.remove('valid');
      this.label.classList.add('error');

      try {
        const parts = resp.msg.split(' - ', 2);
        if (parts[1] === undefined) {
          msg = resp.msg;
        } else {
          const i = parseInt(parts[0], 10);
          if (i.toString() === parts[0]) {
            index = i;
            msg = parts[1];
          } else {
            msg = resp.msg;
          }
        }
      } catch (e) {
        msg = resp.msg;
      }
    }

    const lang = this.settings.language;
    if (
      lang !== 'en' &&
      MailchimpAjax.responses[msg] !== undefined &&
      MailchimpAjax.translations[lang] &&
      MailchimpAjax.translations[lang][MailchimpAjax.responses[msg]]
    ) {
      msg = MailchimpAjax.translations[lang][MailchimpAjax.responses[msg]];
    }

    this.label.textContent = msg;
    this.label.style.display = 'block';

    if (typeof this.settings.callback === 'function') {
      this.settings.callback(resp);
    }
  }
}

// Supports selector string, DOM element, NodeList, or array
function ajaxChimp(target, options) {
  let forms;

  if (typeof target === 'string') {
    forms = document.querySelectorAll(target);
  } else if (target instanceof HTMLElement) {
    forms = [target];
  } else if (NodeList.prototype.isPrototypeOf(target) || Array.isArray(target)) {
    forms = target;
  } else {
    throw new Error('ajaxChimp: target must be selector, HTMLElement, NodeList, or array');
  }

  forms.forEach(form => new MailchimpAjax(form, options));
}

// Expose globally
window.ajaxChimp = ajaxChimp;
