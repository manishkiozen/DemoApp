/***************************
* Login Model
* Authenticate login user
***************************/

 var LoginModel = function(){

 	this.userLogin = function(data, cb){

		getConnection(function(mongoose){
			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			
			model.findOne({ username: data.username, password: data.password }, function(err, result){
				if(err){
					cb(err, null);
				}
				else{
					cb(null, result);
				}
				
				// close connection
				closeConnection(mongoose);
			});
		});
	}
}

LoginModel.__proto__ = new model;

module.exports = LoginModel;