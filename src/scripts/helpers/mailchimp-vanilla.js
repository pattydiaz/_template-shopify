/**
 * 
 * Mailchimp AJAX Vanilla JS
 * 
 */

const ajaxChimp = (selector, options = {}) => {
  let forms;

  // Handle string selector or DOM element
  if (typeof selector === 'string') {
    forms = document.querySelectorAll(selector);
  } else if (selector instanceof Element) {
    forms = [selector];
  } else {
    return;
  }

  forms.forEach(form => {

    // Prevent duplicate listeners
    if (form.dataset.ajaxChimpBound) return;
    form.dataset.ajaxChimpBound = "true";

    const email = form.querySelector('input[type="email"]');
    if (!email) return;

    const label = form.querySelector(`label[for="${email.id}"]`);
    if (!label) return;

    // Settings: use action attribute or fallback to options.url
    const settings = {
      url: form.getAttribute('action') || options.url,
      language: 'en',
      ...options
    };

    // If URL is missing, exit safely
    if (!settings.url) return;

    // Convert to Mailchimp JSONP endpoint
    const url = settings.url.replace('/post?', '/post-json?') + '&c=?';

    form.setAttribute('novalidate', 'true');
    email.setAttribute('name', 'EMAIL');

    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!email.value.trim()) return;

      label.textContent = "Submitting...";
      label.style.display = "block";

      // ---- reCAPTCHA v3 ----
      grecaptcha.ready(() => {
        grecaptcha.execute(settings.recaptchaSiteKey, { action: 'newsletter' }).then(token => {

          const formData = new FormData(form);
          formData.append('g-recaptcha-response', token); // add token

          const params = new URLSearchParams();
          for (const [key, value] of formData.entries()) {
            params.append(key, value);
          }

          const callbackName = 'mc_cb_' + Date.now();

          window[callbackName] = resp => {
            delete window[callbackName];
            script.remove();

            if (resp.result === 'success') {
              label.textContent = "We have sent you a confirmation email";
              label.classList.remove('error');
              label.classList.add('valid');
              email.classList.remove('error');
              email.classList.add('valid');
            } else {
              const msg = resp.msg.replace(/^\d+ - /, '');
              label.textContent = msg;
              label.classList.remove('valid');
              label.classList.add('error');
              email.classList.remove('valid');
              email.classList.add('error');
            }

            if (settings.callback) settings.callback(resp);
          };

          const script = document.createElement('script');
          script.src = url.replace('=?', '=' + callbackName) + '&' + params.toString();
          script.onerror = () => console.error('Mailchimp ajax submit error');
          document.body.appendChild(script);

        });
      });

    });

  });
};