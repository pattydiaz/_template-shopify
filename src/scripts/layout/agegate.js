const Agegate = {
  get() {
    return $(".agegate");
  },

  init() {
    lazyload = new LazyLoad(lazyloadSettings);

    if (this.hide()) {
      this.remove();
      return;
    }

    if (isShopifyEditor) {
      this.shopify();
      Loader.init();
      return;
    }

    this.build();
  },

  build() {
    const agegate = this.get();

    agegate.isVisible()
      ? this.validate()
      : Loader.init();
  },

  shopify() {
    const agegate = this.get();
    if (!agegate.el) return;

    const wrapper = agegate.find(".agegate-wrapper");
    const toggle = agegate.find("#ag_toggle");

    if (wrapper.el?.id === "agegate_hidden") {
      return;
    }

    agegate.removeClass("agegate--hidden");

    if (!wrapper.el || !toggle.el) return;

    toggle.el.onclick = () => {
      agegate.el.classList.toggle("hidden-for-dev");
      wrapper.el.classList.toggle("hidden-for-dev");

      toggle.el.textContent = wrapper.el.classList.contains("hidden-for-dev")
        ? "Show Age Gate"
        : "Hide Age Gate";
    };
  },

  validate() {
    Cookies.get("agegate") === undefined
      ? this.animate()
      : this.remove();
  },

  animate() {
    const agegate = this.get();

    Scrolling.lock();
    agegate.removeClass("agegate--hidden");
    this.focus();

    agegate.find("#ag_accept").on("click", () => {
      Cookies.set("agegate", "true", { expires: 30 });
      agegate.addClass("agegate--hidden");

      setTimeout(() => {
        this.remove();
      }, 400);
    });
  },

  hide() {
    const agegate = this.get();
    return agegate.find("#agegate_hidden").el;
  },

  remove() {
    const agegate = this.get();

    if (agegate.el) {
      agegate.el.classList.add("agegate--hidden");
      agegate.el.remove();
    }

    Loader.init();
  },

  focus() {
    const agegate = this.get();
    if (!agegate.el) return;

    const focusContent = $$("button, a", agegate.el);
    if (!focusContent.length) return;

    const firstFocusEl = focusContent[0];
    const lastFocusEl = focusContent[focusContent.length - 1];

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusEl) {
          e.preventDefault();
          lastFocusEl.focus();
        }
      } else {
        if (document.activeElement === lastFocusEl) {
          e.preventDefault();
          firstFocusEl.focus();
        }
      }
    });
  }
};