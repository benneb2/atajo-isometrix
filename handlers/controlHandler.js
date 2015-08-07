var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');

exports.req = function(obj, cb) {

   _log.d("controlHandler " + JSON.stringify(obj));

   sql.getControls(function(controls){

		_log.d("controlHandler " + JSON.stringify(controls));

		obj.RESPONSE = controls;
		cb(obj);

 });
}
