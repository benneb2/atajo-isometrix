_landing = {

    model : [ ],

    onExit : function() { var _ = this;

    },

    onLoaded: function () { var _ = this;


    	 _model.getAll('landing', function(model) {
    	 	_landing.model = model;
    	 });

    	 layout.attach('#landingFront');

		setTimeout(
			function() {
				_landing._Ctrl();
			}	, 1000);

    },

    onMessage : function() {


    },

    Ctrl : function($scope)
    {
    	$scope.data = _landing.model;
    },

    _Ctrl : function()
  	{
	    e = document.getElementById('landingFront__FACE');

	    scope = angular.element(e).scope();

	    scope.$apply(function()
	    {
	       scope.data = _landing.model;
	    });
  },



};
;;