_showControls = {

  model: [],

  onExit : function()
  {
    var _ = this;
  },

  onLoaded: function ()
  {
    var _ = this;
    //_model.getAll(name of service in config, anan funct  )
    _model.getAll('controlService', function(controlService){
      _showControls.model=controlService;
      layout.attach('#showControlsFront');
    });
  },

  onMessage : function()
  {

  },

  getAll: function($scope)
  {
    $scope.controls = _showControls.model;
    $scope.isControlValueChecked = function(controlGUID, sourceList)
    {
      _log.d("isControlValueChecked - start");
      // _log.d("checking control: " + JSON.stringify(passedInScope));
      _log.d("sourceList: " + JSON.stringify(sourceList));
      if (controlGUID == "" || controlGUID == null)
      {
        _log.d("No control GUID: ");
        return true;
      }
      _log.d("trying to find control with GUID: " + controlGUID);
      var control = $.grep($scope.controls, function(e){ return e.GUID == controlGUID; });
      _log.d("the following control(s) was found: " + JSON.stringify(control));

      if (control.length == 0)
      {
        _log.d("no valid control found");
        return false;
      }
      else if (control.length == 1)
      {
        _log.d("control is a valid control");
        _log.d("trying to find source List: " + sourceList + " in control");
        _log.d(JSON.stringify(control[0].controlValues));
        var sourceListItem = $.grep(control[0].controlValues, function(f){
          _log.d("compare source List: '" + sourceList + "' to '" + f.SourceList + "' with result: " + f.SourceList == sourceList);
          return f.SourceList == sourceList;
        });
        _log.d("the following source List item was found: " + JSON.stringify(sourceListItem));
        if (sourceListItem.length == 0)
        {
          _log.d("sourceListItem is not a valid item");
          return false;
        }
        else if (sourceListItem.length == 1)
        {
          _log.d("sourceListItem is a valid item");
          _log.d(JSON.stringify(sourceListItem[0]));
          if (typeof(sourceListItem[0].isChecked) == "undefined")
          {
            _log.d("isChecked is undefined");
            return false;
          }
          _log.d("returning Checked status: "+JSON.stringify(sourceListItem[0].isChecked));
          _log.d(sourceListItem[0].isChecked);
          _log.d(sourceListItem[0].isChecked == true);
          return sourceListItem[0].isChecked;
        }
        else {
          // multiple items found
          _log.d("multiple control values found with source List: " + sourceList);
          return false;
        }
      }
      else
      {
        // multiple items found
        _log.d("multiple controls found with GUID: " + controlGUID);
        return false;
      }
    };
    $scope.CreatePostingObject = function (){
      var spValues = [];
      var cbLists = [];
      for(c = 0; c < $scope.controls.length; c++)
      {
        //Checkbox List controls need  to be added using [dbo].[spi_M380_1_CheckboxList], so we make a seperate list for them
        var controlGUID = $scope.controls[c].GUID;
        var controlValue = $scope.controls[c].value;
        if ( $scope.controls[c].ModuleDefinitionType != "Checkbox List")
        {
          switch (controlGUID)
          {
            case 'F61463A0':
            controlGUID = 'RiskTypeID_xml';
            controlValue = "<rt>";
            for (var v = 0; v < $scope.controls[c].controlValue; v++)
            {
              if ($scope.controls[c].controlValue[v].isChecked)
              {
                controlValue += "<r id=\" \" riskTypeId=\"" + $scope.controls[c].controlValue[v].SourceListID + "\">";
              }
            }
            controlValue += "</rt>";
            break;
            case '385D7025': //SiteID has 2 values that need to get added
            //we add the default one
            spValues.push({controlGUID : controlValue});
            //and then we make another one for the XML that will get added after the switch
            controlGUID = "SiteID_xml";
            controlValue = "<st><s id=\"\" siteId=\"" +$scope.controls[c].value + "\"></st>";
            break;
            default:
            //do nothing
            break;
          }
          spValues.push({controlGUID : controlValue});

        }
        else
        {
          controlGUID = $scope.controls[c].GUID;
          controlValue = "<chl>";
          for (var cb = 0; cb < $scope.controls[c].controlValue; cb++)
          {
            if ($scope.controls[c].controlValue[cb].isChecked){
              controlValue += "<c id=\"" + cb + "\" moduleDefinitionID=\"" + $scope.controls[c].ModuleDefinitionID + "\" sourceID=\"" + $scope.controls[c].ModuleDefinitionSourceID + "\" sourceListID=\"" + $scope.controls[c].controlValue[cb].SourceListID + "\">";
            }
          }
          controlValue += "</chl>";
          cbLists.push({controlGUID : controlValue});

        }
      }
      var retval = {"cbLists" : cbLists , "spValues" : spValues};
      _log.d(JSON.stringify(retval));
      return retval;
    };
  },
  sendJob : function($scope,name,description,allowDuplicate,clearOnDone,lockUI,cb)
  {
    _log.d("Send job to queue");
    if(typeof name == 'undefined') {  name = "JOB NAME " + code; }
    if(typeof description == 'undefined') {  description = "JOB DESC "; }
    if(typeof allowDuplicate == 'undefined') {  allowDuplicate = false; }
    if(typeof clearOnDone == 'undefined') {  clearOnDone = false; }
    if(typeof lockUI == 'undefined') {  lockUI = false; }
    if(typeof cb == 'undefined') {  cb = false; }


    try
    {

      response = $scope.CreatePostingObject;
      _log.d("Job Data: " + JSON.stringify(response));
      jobData = { action:'postIncident', data: response};

      JOB = {
        jobName: name,
        jobDesc: description,
        data: jobData,
        allowDuplicate: allowDuplicate,
        clearOnDone: clearOnDone,
        lockUI: lockUI,
        callback: cb,
      };

      _log.d("JOB = " + JSON.stringify(JOB));
      jobQueue.add(JOB);



    }catch(err)
    {

      alert(err);

    }

  }

};
;;