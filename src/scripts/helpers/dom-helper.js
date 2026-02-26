/**
 * dom-helper.js
 * 
 * A lightweight, micro jQuery-like DOM helper.
 * 
 * This module provides a minimal wrapper around native DOM APIs.
 * It is inspired by jQuery but intentionally limited to a single
 * wrapped element (uses querySelector, not querySelectorAll).
 * 
 * Provides:
 *  - $(): querySelector wrapper returning a JQueryLite instance
 *  - JQueryLite class for chaining common methods:
 *      - isVisible(): checks if element occupies layout space
 *      - on(): attach event listeners with chaining
 *      - addClass(): add CSS class with chaining
 *      - removeClass(): remove CSS class with chaining
 *      - attr(): get attribute value
 *      - find(): find first matching descendant element
 *      - closest(): find closest ancestor element
 *      - next(): get next sibling element (optionally filtered by selector)
 *      - trigger(): dispatch a basic DOM event on the element
 * 
 * Usage:
 *  const page = $('#page');
 *  page.isVisible();
 *  page.addClass('active').on('click', () => console.log('clicked'));
 * 
 *  const child = page.find('.child');
 *  const parent = page.closest('section');
 *  const nextItem = page.next('.active');
 * 
 *  // Access raw DOM element if needed:
 *  page.el.style.opacity = 1;
 * 
 * Notes:
 *  - Does NOT depend on jQuery.
 *  - Wraps only ONE element.
 *  - Methods safely no-op if the selector does not match.
 *  - trigger() uses new Event(), so events do not bubble by default.
 *  - isVisible() checks layout presence only (not opacity or visibility:hidden).
 *  - $() accepts either a selector string or a DOM element.
 * 
 * Minimal, modular, and extendable.
 */

// Micro jQuery-like wrapper
function $(selector, ctx = document) {
  const el = typeof selector === 'string' ? ctx.querySelector(selector) : selector;
  return new JQueryLite(el);
}

class JQueryLite {
  constructor(el) {
    this.el = el;
  }

  /**
   * Check if the element is visible (layout-based check)
   * @returns {boolean}
   */
  isVisible() {
    return !!(this.el && (this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length));
  }

  /**
   * Attach an event listener to the element (supports chaining)
   * @param {string} event 
   * @param {Function} handler 
   * @param {Object|boolean} [opts] 
   * @returns {JQueryLite}
   */
  on(event, handler, opts) {
    if (this.el) this.el.addEventListener(event, handler, opts);
    return this;
  }

  /**
   * Add a CSS class to the element (supports chaining)
   * @param {string} cls 
   * @returns {JQueryLite}
   */
  addClass(cls) {
    if (this.el) this.el.classList.add(cls);
    return this;
  }

  /**
   * Remove a CSS class from the element (supports chaining)
   * @param {string} cls 
   * @returns {JQueryLite}
   */
  removeClass(cls) {
    if (this.el) this.el.classList.remove(cls);
    return this;
  }

  /**
   * Get an attribute value
   * @param {string} name
   * @returns {string|null}
   */
  attr(name) {
    return this.el ? this.el.getAttribute(name) : null;
  }

  /**
   * Find a descendant element matching selector
   * @param {string} selector
   * @returns {JQueryLite}
   */
  find(selector) {
    if (!this.el) return new JQueryLite(null);
    return new JQueryLite(this.el.querySelector(selector));
  }

  /**
   * Find the closest ancestor matching selector
   * @param {string} selector
   * @returns {JQueryLite}
   */
  closest(selector) {
    if (!this.el) return new JQueryLite(null);
    return new JQueryLite(this.el.closest(selector));
  }

  /**
   * Get the next sibling element.
   * If a selector is provided, returns the next sibling
   * only if it matches the selector (jQuery-like behavior).
   *
   * @param {string} [selector]
   * @returns {JQueryLite}
   */
  next(selector) {
    if (!this.el) return new JQueryLite(null);

    const nextEl = this.el.nextElementSibling;
    if (!nextEl) return new JQueryLite(null);

    if (selector && !nextEl.matches(selector)) {
      return new JQueryLite(null);
    }

    return new JQueryLite(nextEl);
  }

  /**
   * Trigger a DOM event on the element
   * @param {string} eventName
   */
  trigger(eventName) {
    if (!this.el) return;
    this.el.dispatchEvent(new Event(eventName));
  }
}
