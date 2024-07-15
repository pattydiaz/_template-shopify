var Video = {
  init: function () {
    Video.build();
  },
  build: function () {
    Video.fit();
    Video.playback();
  },
  fit: function () {
    var video = $('.video-cover');

    video.each(function() {
      var vid = $(this);
      var vid_id = vid.data('video-id');
      var min_w = 5; // minimum video width allowed
      var vid_w_orig; // original video dimensions
      var vid_h_orig;

      jQuery(function () {
        // runs after DOM has loaded
        var iframe = $(this).find('iframe[id="'+vid_id+'"]');
  
        vid_w_orig = parseInt(iframe.attr("width"));
        vid_h_orig = parseInt(iframe.attr("height"));
  
        Video.resize(vid, vid_w_orig, vid_h_orig, min_w, iframe);
        
        w.on('resize', function () {
          Video.resize(vid, vid_w_orig, vid_h_orig, min_w, iframe);
        });

      });

    });
  },
  resize:function(el, w, h, min, emb) {

    if(el.parents('.video-cover-parent').length) {
      
      var ew = el.parents('.video-cover-parent').width();
      var eh = el.parents('.video-cover-parent').height();

    } else {
      var ew = el.parent().width();
      var eh = el.parent().height();

      // ew = Math.round(ew);
      // eh = Math.round(eh);
    }

    if(el.hasClass('parallax-item')) {
      var ph = el.parent().parent().data('parallax');
      eh = eh + (ph*5)
    }

    // set the video viewport to the [parent] size
    el.width(ew);
    el.height(eh);

    // use largest scale factor of horizontal/vertical
    var scale_h = ew / w;
    var scale_v = eh / h;
    var scale   = Math.max(scale_h, scale_v);


    // don't allow scaled width < minimum video width
    if (scale * w < min) {
      scale = min / w;
    }

    emb.width(scale * w).height(scale * h);
  },
  playback: function(el) {
    var video = $('.video-cover');
  
    video.each(function(){
      var $this = $(this);
      var parent = $this.parent();
      var iframe = $this.find('iframe')[0];

      ScrollTrigger.create({
        // markers: true,
        trigger: $this,
        start: '-10 100%',
        end: parent.outerHeight()+' 0',
        onEnter: () => { Video.play(iframe); },
        onLeave:() => { Video.pause(iframe); },
        onEnterBack: () => { Video.play(iframe); },
        onLeaveBack: () => { Video.pause(iframe); }
      });

    });
  },
  play: function(el) {
    var iframe = el;

    if(iframe) {
      if($(iframe).hasClass('lazy')) {
        var interval = setInterval(() => {
          if($(iframe).attr('src') != undefined) {
            clearInterval(interval);
            var vimeo_video = new Vimeo.Player(iframe);
            vimeo_video.play();
          } 
        }, 10);
      }
    }
  },
  pause: function(el) {
    var iframe = el;

    if(iframe) {
      if($(iframe).hasClass('lazy')) {
        var interval = setInterval(() => {
          if($(iframe).attr('src') != undefined) {
            clearInterval(interval);
            var vimeo_video = new Vimeo.Player(iframe);
            vimeo_video.pause();
          } 
        }, 10);
      }
    }
  },
};