/*************************************
* User Authentication Controller
*************************************/

var SignupController = function(){
	
	var signup_model;
	var model = require('../models/signup-model');
	signup_model = new model();

	this.index = function(){
		Res.render('signup'+fileExt,{url:url, errors: false});
	}

	this.checkUsername = function(){

		// login user with his credential 
		signup_model.checkUsername(Req.body.username, function(err, result){

			if( err ){
				throw err;
			}
			else{

				if( result ){
					Res.send('0'); 	
				}
				else{
					Res.send('1'); 	
				}
				
			}
			
			Res.end(); 	
		});
	}

	this.addNewUser = function(){

		var currentDateTime = getDate()+' '+getTime();
		var data = {}; 
		data = Req.body;
		data.date = currentDateTime;
		
		// login user with his credential 
		signup_model.addNewUser(data, function(err, result){

			if( err ){
				throw err;
			}
			else{

				if( result ){
					Req.session.userId = result._id;
					Req.session.userName = result.name;
					Req.session.userImg = result.image;
					Req.session.userEmail = result.email;
					// render user to dashboard page
					Res.redirect('/dashboard');
				}
				else{
					// render user to login page with error
					Res.render('signup'+fileExt, { 
			            errors: 'New user could not sign up',
			            url:url
			        });
				}
				
			}
			
			Res.end(); 		
		});
	}
}

SignupController.__proto__ = new controller();

module.exports = SignupController;