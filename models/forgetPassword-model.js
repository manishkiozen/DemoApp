/***************************
* Login Model
* Authenticate login user
***************************/

 var ForgetPassword = function(){

 	this.verifyUser = function(email, cb){

		getConnection(function(mongoose){
			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			
			model.findOne({ email: email },'_id', function(err, result){
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

	this.mailSetting = function(){

		var directTransport = require('nodemailer-direct-transport');
		var nodemailer = require('nodemailer');
		var options = {
				service: 'yandex',
				auth: {
				user: 'manish.kumar@kiozen.com',
				pass: 'manish1989'
		}};

		return nodemailer.createTransport(directTransport(options)); 
	}

	this.changePassword = function(userId, password, cb){
		getConnection(function(mongoose){
			// create member 
			var model = require('../database/loginSchema').UserSchema(mongoose);
			
			model.update({ _id: userId },{password: password}, function(err, result){
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

ForgetPassword.__proto__ = new model;

module.exports = ForgetPassword;