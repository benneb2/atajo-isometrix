var mssql = require('mssql');
var config   = require('../sql/config');
var _log = require('../../lib/log');
var grep = require('grep-from-array');

var sql = {


  getControls: function(callback)
  {
      RESPONSE = [];
      controls = {
        controlID :0,
        incidentStatus: [],
        users : [],
        sites : [],
        };

      sql.getIncidentStatus(function(obj){
        if(obj != false)
        {
          controls.incidentStatus = obj;
        }

        sql.getUsers(function(obj){
          if(obj != false)
          {
            controls.users = obj;
          }

          sql.getSites(function(obj){
            if(obj != false)
            {
              controls.sites = obj;
            }
            RESPONSE.push(controls);
            callback(RESPONSE);
          });

        });
      });

  }
  ,
  buildTree: function(elements,parentId) 
  {
    branch = [];
    var newElement = {
      SiteID : 0,
      children : []
    };
    for (var i in elements) {
      var element = elements[i];

        if (element.ParentID == parentId) {
            children = sql.buildTree(elements, element.SiteID);
            if (children) {
              newElement.SiteID = element.SiteID;
              newElement.Site = element.Site;
              newElement.children = children.slice();
            }
            branch.push(newElement);
        }
    }
    return branch;
  }
  ,

  getSites : function(callback)
  {
    _log.d("getSites");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select SiteID, ParentID,Site from [dbo].[tblSite] where isDeleted IS NULL order by Site";;
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getSites: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getSites: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getSites: GOOD " + JSON.stringify(recordset));

            siteObj = sql.buildTree(recordset,0);
            _log.d("");
            _log.d("getSites: siteObj " + JSON.stringify(siteObj));
            _log.d("");
            callback(siteObj);
            return;
        }
      });
    }); 
  }
  ,
  getUsers : function(callback)
  {
    _log.d("getUsers");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select UserID, FirstName,LastName from [dbo].[tblUser] where isDeleted IS NULL order by FirstName";;
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("getUser: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("getUser: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
            _log.d("getUser: GOOD " + JSON.stringify(recordset));
            callback(recordset);
            return;
        }
      });
    }); 
  }
  ,
  getIncidentStatus : function(callback)
  {
    _log.d("getIncidentStatus");

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    var queryString = "Select * from [dbo].[tblModuleDefinitionSourceList] where SourceID = '"+ 25 + "'";
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("Login: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("Login: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
          if(recordset.length == 0)
          {
            _log.d("Login: User Not Found ");
            callback(false);
            return;
          }else
          {
            _log.d("Login: GOOD " + JSON.stringify(recordset));
            callback(recordset);
            return;
          }
        }
      });
    }); 

  },

  login : function(obj,callback)
  {

    _log.d("Login with " + JSON.stringify(obj));

    var conParams = config.conParams[GLOBAL.RELEASE];

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };


    var queryString = "Select TOP 1 * from [dbo].[tblUser] where UserName = '"+ obj.credentials.username + "'";
    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d("Login: mssql Conn Error " + err);
        callback(false);
        return;
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d("Login: Query Error " + err);
          callback(false);
          return;
        }
        else
        {
          if(recordset.length == 0)
          {
            _log.d("Login: User Not Found ");
            callback(false);
            return;
          }else
          {
            _log.d("Login: GOOD " + JSON.stringify(recordset[0]));
            callback(recordset[0]);
            return;
          }
        }
      });
    });    
  }
  ,
  getControlsWithValues_old: function(callback)
  {
    var LoggedInUserID = 1;  //change this to use the actual user
    // _log.d("getControlsWithValues - Start");
    sql.getControls(function (controls, LoggedInUserID)
    {
      // _log.d("Initial Record set:");
      // _log.d(JSON.stringify(controls));
      //
      // _log.d("getControlsWithValues - for loop start");
      for(i = 0; i < controls.length; i++)
      {
        if (controls[i].MultiOptionControl=="true")
        {
          // _log.d("i == " + i);
          // _log.d("initial controls[i]: ");
          // _log.d(JSON.stringify(controls[i].ModuleDefinitionLabel));
          // _log.d("controls[i].ModuleDefinitionSourceID: ");
          // _log.d(controls[i].ModuleDefinitionSourceID);

          sql.getControlValues(controls[i].ModuleDefinitionSourceID, LoggedInUserID, (function (controlValues)
          {
            sql.putControlValuesIntoRecordset(controls, controlValues, function (controls){
              // _log.d("getControlsWithValues - Checkfilled start");
              if (sql.checkFilled(controls))
              {
                // _log.d("Complete recordset: ");
                // _log.d(controls);
                // _log.d("getControlsWithValues - Finished");
                callback(controls);
              }

            });

          }));
        }
      }
      //callback();
    });
  },

  getControls_old: function (cb, LoggedInUserID)
  {
     _log.d("getControls - Start");

    var conParams = config.conParams[GLOBAL.RELEASE];
     _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };

    // _log.d(JSON.stringify(sqlConfig) );

    var queryString = "Select * from MobileControl";

    // _log.d(queryString);
    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }
      var request = new mssql.Request(connection); // or: var request = connection.request();
      request.query(queryString, function (err, recordset) {
        if (err)
        {
          _log.d(err);
          cb(400, err);
        }
        else
        {
          cb(recordset);
        }
      });
    });
  },

  getControlValues: function (SourceID, LoggedInUserID, cb)
  {
    // _log.d("getControlValues - Start");
    // _log.d("SourceID: " + SourceID);
    // _log.d("LoggedInUserID: " + LoggedInUserID);
    //this might not return a value so we need to implement a callback
    var conParams = config.conParams[GLOBAL.RELEASE];
    // _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };
    // _log.d(JSON.stringify(sqlConfig) );

    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }

      var request = new mssql.Request(connection); // or: var request = connection.request();

      request.input('LoggedInUserID', LoggedInUserID);
      request.input('SourceID', SourceID);
      var storedProcedure = '[dbo].[spm_GetControlSourceInformationBySourceID]';
      request.execute(storedProcedure, function (err, recordsets, returnValue)
      {
        if (err)
        {
          _log.d(err);
        }
        else
        {
          // _log.d("i == " + i);
          // _log.d("Control Record set:");
          // _log.d("SourceID: " +SourceID);
          // _log.d("LoggedInUserID: " + LoggedInUserID);
          _log.d(JSON.stringify(recordsets));
          _log.d("attempting to establish hierarchy");
          sql.arrangeControlValuesIntoHeirarchy(recordsets[0], function (retval) {
          _log.d("controlValues (post hierarchy): " + JSON.stringify(retval));
          cb(retval);
          });

        }
      });

    });
  },

  putControlValuesIntoRecordset: function (controls, controlValues, cb)
  {
    // _log.d("putControlValuesIntoRecordset - Start");
    // _log.d("controlValues: " + JSON.stringify(controlValues));
    // _log.d("control SourceID: " + JSON.stringify(controlValues[0].SourceID));

    for(i = 0; i < controls.length; i++)
    {
      if (controls[i].ModuleDefinitionSourceID == controlValues[0].SourceID)
      {
        controls[i].controlValues = controlValues;
        // _log.d("control: " + i + " Control definition" + JSON.stringify(controls[i]));
      }
    }
    // _log.d("putControlValuesIntoRecordset - Finished");
    cb(controls);
  },

  checkFilled: function (controls)
  {
    // _log.d("checkFilled - Start");
    for(i = 0; i < controls.length; i++)
    {
      // _log.d("controls[i].MultiOptionControl: " + controls[i].MultiOptionControl);
      if (controls[i].MultiOptionControl=="true")
      {
        // _log.d("controls[i].controlValues: " + JSON.stringify(controls[i].controlValues));
        if (typeof(controls[i].controlValues) === "undefined")
        {
          // _log.d("Checkfilled: false (controlValues NULL): "  + JSON.stringify(controls[i]));
          return false;
        }
      }
    }
    // _log.d("Checkfilled: true");
    return true;
  },

  arrangeControlValuesIntoHeirarchy: function (controlValues, cb)
  {
    //first identify if the control is a hierarchy
    var isHeirarchy = false;

    var parentNodes = grep(controlValues, function(e){
      _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
      return e.HierarchyLevel == 1 || e.HierarchyLevel == null || e.HierarchyLevel == "";
    });
    _log.d(typeof(controlValues[0].SourceListParentID));
    _log.d("parentNodes: " + JSON.stringify(parentNodes));

    if (parentNodes.length === 0)
    {
      _log.d("there are NO parent nodes");
      isHeirarchy = false;
    }
    else
    {
      _log.d("there are parent nodes");
      isHeirarchy = true;
    }

    //if it's a heirarchy arrange the controls accordingly
    if (isHeirarchy) {
      //attach relevant children to the parent nodes

      sql.attachChildrenToParent(parentNodes,controlValues, function (parentNodes) {
        controlValues = parentNodes;
        _log.d("Hierarchical: " + JSON.stringify(controlValues));
      });
    }
    else {
      _log.d("non-Hierarchical: " + JSON.stringify(controlValues));
      //return controlValues;
    }
    cb(controlValues);

  },

  attachChildrenToParent: function (parentNodes, controlValues, done)
  {
    //go through each parent node and attach children
    for(p = 0; p < parentNodes.length; p++)
    {
      _log.d("parentNodes[" + p + "] of : " + parentNodes.length-1 + " (" +  parentNodes[p].SourceListID + " - " + parentNodes[p].SourceList +") HasChild: " + parentNodes[p].HasChild);

      if ((parentNodes[p].HasChild == 1) || (parentNodes[p].HasChild == "1"))
      {
        //get the nodes that belong to this parent
        var nodesToAddAsChildren = grep(controlValues, function(e){
          var isHierachyLvl2 = JSON.stringify(e.HierarchyLevel) == "2";
          var isCorrectParent = JSON.stringify(e.SourceListParentID) == JSON.stringify(parentNodes[p].SourceListID);
          if (parentNodes[p].SourceID == 1050)
          {
          _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
          _log.d("e.SourceListParentID: " + JSON.stringify(e.SourceListParentID));
          _log.d("parentNodes[p].SourceListID: " + JSON.stringify(parentNodes[p].SourceListID));
}
          if (isHierachyLvl2 && isCorrectParent)
          {
            if (parentNodes[p].SourceID == 1050)
            {
              _log.d("e.HierarchyLevel: " + JSON.stringify(e.HierarchyLevel));
              _log.d("e.SourceListParentID: " + JSON.stringify(e.SourceListParentID));
              _log.d("parentNodes[p].SourceListID: " + JSON.stringify(parentNodes[p].SourceListID));
            }
            return true;
          }
          else {
            {return false;}
          }
        });

        _log.d("children to add to parent (" + JSON.stringify(parentNodes[p]) + "): " + JSON.stringify(nodesToAddAsChildren));
        //only if there are items do we add the children.
        if (nodesToAddAsChildren.length !=0)
        {
          //add them to the parent
          parentNodes[p].Children = nodesToAddAsChildren;

          for (c = 0; c < parentNodes[p].Children.length; c++)
          {
            if (parentNodes[p].Children[c].SourceID == 1050)
            {
              _log.d("childNode[" + c + "] of : " + parentNodes[p].Children[c].length-1 + " (" +  parentNodes[p].Children[c].SourceListID + " - " + parentNodes[p].Children[c].SourceList +") HasChild: " + parentNodes[p].Children[c].HasChild);
            }

            if (parentNodes[p].Children[c].HasChild == 1)
            {
              var nodesToAddAsChildren1 = grep(controlValues, function(e){
                return e.HierarchyLevel == 3 && e.SourceListParentID == parentNodes[p].Children[c].SourceListID;
              });

              if (nodesToAddAsChildren1.length !=0)
              {
                parentNodes[p].Children[c].Children = nodesToAddAsChildren1;
              }
            }
          }

        }
        if (parentNodes[p].SourceID == 1050)
        {
        _log.d("Final Parent Node: " + JSON.stringify(parentNodes[p]));
      }
      }
    }

    _log.d("pre-Return Hierarchical Parents: " + JSON.stringify(parentNodes[p]));


    if (grep(parentNodes,function(e){return e.HasChild==1 && typeof(e.Children) == "undefined";}).length == 0) {
      _log.d("Return Hierarchical Parents: " + JSON.stringify(parentNodes));
      done(parentNodes);
    }
  },
  postIncident: function(obj, callback)
  {
    _log.d("postIncident - Start");
    _log.d("obj: " + JSON.stringify(obj));
    //this might not return a value so we need to implement a callback
    var conParams = config.conParams[GLOBAL.RELEASE];
    _log.d(JSON.stringify(conParams) );

    var sqlConfig =
    {
      user: conParams.user,
      password: conParams.password,
      server: conParams.server,
      database: conParams.database,
      options: {
        appName : conParams.applicationName
      }
    };
    _log.d(JSON.stringify(sqlConfig) );

    var connection = new mssql.Connection(sqlConfig, function (err) {
      if (err)
      {
        _log.d(err);
      }

      var request = new mssql.Request(connection);
                 request.input('SiteID_xml', obj.data.spValues.SiteID_xml);
                 request.input('RiskTypeID_xml', obj.data.spValues.RiskTypeID_xml);
                 request.input('c1E8BCC9E', obj.data.spValues.c1E8BCC9E);
                 request.input('c385D7025', obj.data.spValues.c385D7025);
                 request.input('c3D7380B8', obj.data.spValues.c3D7380B8);
                 request.input('c3E7CF6D4', obj.data.spValues.c3E7CF6D4);
                 request.input('c7C5F61F0', obj.data.spValues.c7C5F61F0);
                 request.input('c85B29C24', obj.data.spValues.c85B29C24);
                 request.input('cA299231D', obj.data.spValues.cA299231D);
                 request.input('cAA24747C', obj.data.spValues.cAA24747C);
                 request.input('cBCDBB162', obj.data.spValues.cBCDBB162);
                 request.input('cBF638E94', obj.data.spValues.cBF638E94);
                 request.input('UserID', obj.data.UserID);
                 request.output('Scope', mssql.BigInt);

      var storedProcedure = '[dbo].[spi_M380_1]';
      request.execute(storedProcedure, function (err, recordsets, returnValue)
      {
        if (err)
        {
          _log.d(err);
        }
        else
        {
          //TODO: Notification triggers use  request.parameters.Scope.value
          //TODO: Checkbox lists

          cb(retval);

        }
      });

    });

  }
}
module.exports = sql;
