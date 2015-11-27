/***************************
* Dashboard Model
* Authenticate login user
***************************/

 var DashboardModel = function(){

 	var _self = this;

 	// get user information
	this.getUserInfo = function(userId, cb){
		
		getConnection(function(mongoose){

			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			
			model.findOne({ _id: userId }, function(err, result){

				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{
					cb(null, result);
				}
			});
		});
	}

	// get device information
	this.getDevices = function(userid, cb){

		getConnection(function(mongoose){

			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);
			// userid: userid
			model.find({}, function(err, result){

				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{
					cb(null, result);
				}
			});
		});
	}

	// get dashboard information
	this.getUserAndDeviceInfo = function(userid, cb){
		
		var locals = { userinfo:{}, deviceinfo:{} };
		var error = null;

		var async = require('async');
		async.waterfall([

	        //Load user information
	        function(callback) {
	        	_self.getUserInfo(userid, function(err, data){
	        		if(err){
	        			return callback(err, null);
	        		}

	        		locals.userinfo = data;
	        		callback(null, locals);
	        	});
	        },

	        //Load device information
	        function(locals, callback) {

	            _self.getDevices(userid, function(err, result){
	            	if(err){
	        			return callback(err, null);
	        		}

	        		locals.deviceinfo = result;
	        		callback(null, locals);
	            });
	        	   	
	        }

	    ], function(err, result) { //This function gets called after the two tasks have called their "task callbacks"
	        if (err){
	        	error = err;
	        }  

	        cb(error, result);
	        locals = null;
	        error = null;
	    });
	}

}

DashboardModel.__proto__ = new model;

module.exports = DashboardModel;