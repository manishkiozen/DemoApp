/*************************************
* User Authentication Controller
*************************************/

var LoginController = function(){
	
	var login_model;
	var model = require('../models/login-model');
	login_model = new model();

	this.index = function(){

		if( Req.session == undefined ){
			Res.render('login'+fileExt,{url:url, errors: false});
		}	
		else{
			// admin already login then send it to dashboard
			 if (Req.session.userId) {
			 	Res.redirect('/dashboard');
			 }
			 else{ // render user to login page
			 	Res.render('login'+fileExt,{url:url, errors: false});
			 }
		}	
		
		Res.end();
	}

	this.userLogin = function(){

		// login user with his credential 
		login_model.userLogin(Req.body, function(err, result){

			if( err ){
				throw err;
			}
			else{

				if( result ){
					Req.session.token = (Math.floor(Math.random() * 100) + 1  )+result._id;
					Req.session.userId = result._id;
					Req.session.userName = result.name;
					Req.session.userImg = result.image;
					Req.session.userEmail = result.email;
					// render user to dashboard page
					Res.redirect('/devices');
				}
				else{
					// render user to login page with error
					Res.render('login'+fileExt, { 
			            errors: 'Please enter valid username or password',
			            url:url
			        });
				}
				
			}
			
			Res.end(); 	
		});
	}
}

LoginController.__proto__ = new controller();

module.exports = LoginController;