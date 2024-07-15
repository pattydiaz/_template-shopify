var consent = $('#consent');

var Consent = {
  init: function(){
    Consent.build();
  },
  build: function(){
    if(consent.is(':visible')) Consent.validate();
  },
  validate: function(){
    if(localStorage.getItem('consentMode') === null) {

      $('#btn-accept').on('click',function(){
        Consent.set({necessary:true,analytics:true,preferences:true,marketing:true});
        Consent.hide();
      });

      $('#btn-reject').on('click',function(){
        Consent.set({necessary:false,analytics:false,preferences:false,marketing:false});
        Consent.hide();
      });

      Consent.show();
    }
  },
  hide: function(){
    consent.removeClass('consent--active');
  },
  show: function() {
    ScrollTrigger.create({
      // markers: true,
      trigger: wrapper,
      start: wh/2+' 0',
      onEnter: () => {
        if(localStorage.getItem('consentMode') === null) consent.addClass('consent--active');
      }
    });
  },
  set: function(consent){
    const consentMode = {
      'functionality_storage': consent.necessary ? 'granted' : 'denied',
      'security_storage': consent.necessary ? 'granted' : 'denied',
      'ad_storage': consent.marketing ? 'granted' : 'denied',
      'analytics_storage': consent.analytics ? 'granted' : 'denied',
      'personalization': consent.preferences ? 'granted' : 'denied',
    };
    gtag('consent', 'update', consentMode);  
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
  },
}