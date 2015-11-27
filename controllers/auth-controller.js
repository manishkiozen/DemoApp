/*************************************
* User Authentication Controller
*************************************/

var AuthController = function(){
	
	var auth_model;
	var model = require('../models/auth-model');
	auth_model = new model();

	this.authenticateUser = function(){

		if( Req.query.username != '' && Req.query.password != '' ){

			// login user with his credential 
			auth_model.authenticateUser( { username: Req.query.username , password: Req.query.password } , function(err, result){

				if( err ){
					Res.send('0');
				}
				else{

					if( result ){
						// send user id in response
						Res.send('1');
					}
					else{
						// render user to login page with error
						Res.send('0');
					}					
				}
				
				Res.end(); 	
			});
		}
		else{
			Res.send('0');
			Res.end(); 
		}		
	}

	this.getUserId = function(){

		// login user with his credential 
		auth_model.authenticateUser( { username: Req.query.username , password: Req.query.password } , function(err, result){

			if( err ){
				Res.send(err);
			}
			else{

				if( result ){
					// send user id in response
					Res.send(result._id);
				}
				else{
					// render user to login page with error
					Res.send('failed');
				}					
			}
			
			Res.end(); 	
		});
		
	}
}

AuthController.__proto__ = new controller();

module.exports = AuthController;