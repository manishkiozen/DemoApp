/***************************
* Login Model
* Authenticate login user
***************************/

 var AuthModel = function(){

 	this.authenticateUser = function(data, cb){

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

AuthModel.__proto__ = new model;

module.exports = AuthModel;