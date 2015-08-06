//var community = require('../adapters/community/adapter');
var _log = require('../provider/lib/log');
var sql = require('../provider/adapters/sql/adapter');


exports.req = function (obj, cb) {

		sql.login(obj,function(response)
		{
			if(response == false)
			{
				obj.RESPONSE = false;
				cb(obj);
				return;
			}else
			{
				obj.RESPONSE = '12345abcdef';
 				cb(obj);
		 		return;

				_log.d(JSON.stringify(response));
				obj.RESPONSE = "123456";
				obj.ROLES    = [];
				//obj.user = response;
				cb(obj);
				return;
			}
		});

		obj.RESPONSE = false;
		obj.ROLES    = [];
		cb(obj);
		return;
		

/*
		community.loginToken(obj.credentials.username, obj.credentials.password, function(token, response) {

				if (token) {

						obj.RESPONSE = token;
						obj.ROLES    = response.details.roles;

						//cb(token, response.details);

				} else {

					obj.RESPONSE = false;
					obj.ROLES    = [];

					//  cb(token);

				}

				cb(obj);

		});
*/
}


// //var community = require('../adapters/community/adapter');
// var _log = require('../provider/lib/log');


// exports.req = function (obj, cb) {

// 	  obj.RESPONSE = '12345abcdef';
// 		 cb(obj);
// 		 return;


// 		community.loginToken(obj.credentials.username, obj.credentials.password, function(token, response) {

// 				if (token) {

// 						obj.RESPONSE = token;
// 						obj.ROLES    = response.details.roles;

// 						//cb(token, response.details);

// 				} else {

// 					obj.RESPONSE = false;
// 					obj.ROLES    = [];

// 					//  cb(token);

// 				}

// 				cb(obj);

// 		});

// }
