_incidentCapture = {

    model: null,

    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;
      layout.attach('#incidentCaptureFront');
               layout.attach('#incidentCaptureStep2');
               layout.attach('#incidentCaptureStep3');
               layout.attach('#incidentCaptureStep4');
               layout.attach('#incidentCaptureComplete');

               _storage.model =
               {
                  common : {},
                  other : {},
               };




    },

    onMessage : function() {



    },
Ctrl: function($scope){},
Ctrl2: function($scope){},
Ctrl3: function($scope){},

    FlipCard: function(flipTarget, cb){_cardEngine.flip("incidentCapture", flipTarget, function(release) {
      _log.d("Flip Target:");
      _log.d(flipTarget);
      release();
      layout.attach('#'+flipTarget);

      if(cb) {
        cb();
      }
    });
  },

};
;;
