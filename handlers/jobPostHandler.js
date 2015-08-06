var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

//this is a callback that waits for the funtion call to finish
_log.d("Start Handler - fetch");
 sql.postIncident(obj, function(postIncident){
    _log.d("RESPONSE: " + JSON.stringify(getControlsWithValues));
   obj.RESPONSE = postIncident;
   cb(obj);
 });
}
