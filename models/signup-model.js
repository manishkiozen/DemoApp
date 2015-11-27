/***************************
* Login Model
* Authenticate login user
***************************/

 var SignupModel = function(){

 	this.checkUsername = function(username, cb){

		getConnection(function(mongoose){
			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			
			model.findOne({ username: username }, function(err, result){
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

	this.addNewUser = function(data, cb){

		getConnection(function(mongoose){
			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			var schema = model({
				name: data.name,
				username: data.username,
				email: data.email,
				password: data.password,
				dateTime: data.date
			});

			// save new member information
			schema.save(function(err, result){
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

SignupModel.__proto__ = new model;

module.exports = SignupModel;