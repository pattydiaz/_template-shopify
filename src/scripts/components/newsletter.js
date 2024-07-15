var Newsletter = {
  init: function () {
    Newsletter.build();
  },
  build: function() {
    Newsletter.form($('#mc-form-newsletter'));
  },
  form: function (el) {
    if (el.is(":visible")) {

      el.ajaxChimp({
        callback: callbackFunction,
      });

      function callbackFunction(resp) {
        if (resp.result === "success") {
          el.next().removeClass('d-none');
          el.remove();
        }
      }

    }
  }
};