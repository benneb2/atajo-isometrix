//var community = require('../adapters/community/adapter');
var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');


exports.req = function (obj, cb) {

	_log.d("LOGIN");
	sql.login(obj,function(response)
	{
		if(response == false)
		{
			obj.RESPONSE = false;
			cb(obj);
			return;
		}else
		{
			obj.RESPONSE = true;
			obj.user = response;
			cb(obj);
			return;
		}
	});
}