var Inputs = {
  init: function () {
    Inputs.build();
  },
  build: function () {
    Inputs.field();
  },
  field: function () {
    $("input, textarea").each(function () {
      var $this = $(this);
      var $parent = $this.parents(".input");

      $this
        .on("focusin", function () {
          $parent.addClass("active");
        })
        .on("focusout", function () {
          if ($this.val() == "") $parent.removeClass("active");
        });
    });
  },
};
