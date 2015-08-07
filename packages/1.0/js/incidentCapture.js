_incidentCapture = {

    model: null,
    incidentStatus : [],
    incidentStatusSelect : null,
    users : [],
    usersSelect : null,
    sites : [],
    siteSelect : null,
    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;


      _model.getAll('controlService', function(model) {

        if(model.length == 0)
        {
          alert("DOWNLOAD THE CONTROLLS");
        }
        _incidentCapture.model = model[0];

        for(var i in _incidentCapture.model.incidentStatus)
        {
          var item = _incidentCapture.model.incidentStatus[i];

          if(item.SourceID == 25)
          {
             _.incidentStatus.push(item);
          }
        }
        if(_.incidentStatus.length > 0)
        {
          _.incidentStatusSelect = _.incidentStatus[0];
        }

        for(var i in _incidentCapture.model.users)
        {
          var item = _incidentCapture.model.users[i];
          user = {
            UserID : item.UserID,
            name : item.FirstName + " " + item.LastName,
          }
           _.users.push(user);
        }

        for(var i in _incidentCapture.model.sites)
        {
          var site = _incidentCapture.model.sites[i];
          
           _.sites.push(site);
        }
      // _incidentCapture._Ctrl();
      });

      layout.attach('#incidentCaptureFront');
      layout.attach('#incidentCaptureStep1');
      layout.attach('#incidentCaptureStep2');
      layout.attach('#incidentCaptureStep3');
      layout.attach('#incidentCaptureStep4');
      layout.attach('#incidentCaptureComplete');

    },
  didPrep:false,
  prepareList : function() {
    if(_incidentCapture.didPrep == false)
    {
      
      setTimeout(
      function() {
        _incidentCapture.didPrep = false;
      } , 1000);

      $('#expList').find('li').click( function(event) {

            if (this == event.target) {
              if($(this).has('ul').length)
              {
                
                $(this).toggleClass('expanded');
                if($(this).has('x').length)
                {
                  if($(this).hasClass( "expanded" ))
                  {
                    $(this).children('x')[0].innerHTML = '&#xf068;';
                  }else
                  {
                    $(this).children('x')[0].innerHTML = '&#xf067;';
                  }
                  
                }

                $(this).children('ul').toggle('medium');
              }else
              {
                alert("END ITEM");
              }
          }
          
          return false;
        }).addClass('collapsed').children('ul').hide();

      $('#expList').find('x').click( function(event) {

          if (this == event.target) 
          {
            var li = $(this).closest("li");
            if($(li).has('ul').length)
            {
              $(li).toggleClass('expanded');
              $(li).children('ul').toggle('medium');

              if($(li).hasClass( "expanded" ))
              {
                $(li).children('x')[0].innerHTML = '&#xf068;';
              }else
              {
                $(li).children('x')[0].innerHTML = '&#xf067;';
              }

            }

          }
          
          return false;
        });
    }
    
  },


currStep : 0,
onMessage : function(data) {
  currStep = data;
  _incidentCapture.FlipCard('incidentCaptureStep' + data,false);

},

Ctrl: function($scope){

},

Ctrl1: function($scope){
  $scope.model = {};
  $scope.model.incidentStatus = _incidentCapture.incidentStatus;
  $scope.model.incidentStatusSelect = _incidentCapture.incidentStatusSelect;
},

_Ctrl: function($scope){
  // e = document.getElementById('barcodeFront__FACE');
      
  //     scope = angular.element(e).scope();
      
  //     scope.$apply(function() 
  //     {  
  //         scope.incidentStatus = _incidentCapture.incidentStatus;
  //     });
},

Ctrl2: function($scope){
$scope.model = {};
$scope.model.users = _incidentCapture.users;
$scope.model.usersSelect = _incidentCapture.usersSelect;
},

Ctrl4: function($scope){

  
  $scope.model = {};
  $scope.model.sites = _incidentCapture.sites;

  setTimeout(
      function() {
        _incidentCapture.prepareList();
      } , 1000);
  
  
},

save: function(step)
{
  if(step == 1)
  {
    e = document.getElementById('incidentCaptureStep1__FACE');
    scope = angular.element(e).scope();
    alert("save " + scope.model.incidentStatusSelect.SourceList);

  }else if(step == 2)
  {
    alert("SAVE2");
    e = document.getElementById('incidentCaptureStep2__FACE');
    scope = angular.element(e).scope();
    alert("save " + scope.model.usersSelect.name);

  }

},
FlipCard: function(flipTarget, cb){

      _cardEngine.flip("incidentCapture" , flipTarget, function(release) {

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
