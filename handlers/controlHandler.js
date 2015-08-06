var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("controlHandler " + JSON.stringify(obj));

   sql.getControlsWithValues(function(getControlsWithValues){

		_log.d("controlHandler " + JSON.stringify(getControlsWithValues));

		obj.RESPONSE = getControlsWithValues;
		cb(obj);

 });
}
