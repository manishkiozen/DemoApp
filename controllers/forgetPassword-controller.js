/*************************************
* User Authentication Controller
*************************************/

var ForgetPassword = function(){
	
	var forgetPassword_model;
	var model = require('../models/forgetPassword-model');
	forgetPassword_model = new model();

	this.index = function(){

		// check session message
		var msg = {error: false, success: false, url:url};
		
		// render page at forget password
		Res.render('forgetPassword'+fileExt, msg);

		// set null value into message session
		Req.session.msg= null;
	}

	// send mail to user for reset password
	this.sendEmail = function(){

		forgetPassword_model.verifyUser(Req.body.email,function(err, result){
			if(err){
				throw err;
			}
			else{

				console.log('get result'+JSON.stringify(result));
				// check result after check email address
				if(result){

					var token = result._id+'kioxApp';
					console.log('sending mail');
					// send mail to user
					var smtpTransport = forgetPassword_model.mailSetting();
					smtpTransport.sendMail(
						{
							from: "Kiox <manish.kumar@kiozen.com>", // sender address
							to: " <"+Req.body.email+">", // comma separated list of receivers
							subject: "Reset password", // Subject line
							html: " Hi,<br> Please click given below link for reset your password:-<br><a href='"+url+"/forgetPassword/resetPassword/?token="+token+"&u="+result._id+"' target='_blank'>"+url+"/forgetPassword/resetPassword/?token="+token+"&u="+result._id+"</a> <br><br><p><strong>Koix Team</strong></p>" // plaintext body
						}, function(error, response){

						if(error){
							console.log('error'+error);
							throw error;
						}else{
							console.log('response'+JSON.stringify(response));
							
						}
					});

					Res.render('forgetPassword'+fileExt,{ url:url, error : false, success: 'Password reset link has been sent your registered email address'});
					
				}
				else{
					console.log('result not found');
					Res.render('forgetPassword'+fileExt, { url:url, error : 'Forget password process failed. Please try again', success: false});
				}
				console.log('sending mail successfully');
				Res.end();
			}
		})
	}

	// reset password
	this.resetPassword = function(){

		if(Req.query.u != ''){
			var token = Req.query.u+'kioxApp';

			if( token ==  Req.query.token){
				console.log('true');
				Req.session.resetId = Req.query.u; 
				Res.render('resetPassword'+fileExt, { url: url, success: false, error: false });
			}
			else{
				console.log('false');
				Res.render('forgetPassword'+fileExt, { url:url, error : 'Your token is mismatch. Please try again', success: false});
			}
		}
		else{
			Res.render('forgetPassword'+fileExt, { url:url, error : 'Wrond reset url. Please send link again', success: false});
		}	

		Res.end();
	}

	this.changePassword = function(){

		forgetPassword_model.changePassword(Req.session.resetId, Req.body.password, function(err, result){
			if(err){
				throw err;
			}
			else{
				if(result){
					Res.render('resetPassword'+fileExt, { url: url, success: 'Password has reset successfully!', error: false });
				}
				else{
					Res.render('resetPassword'+fileExt, { url: url, success: false, error: 'Password could not reset. Please try again!' });
				}
			}
		});
	}

}

ForgetPassword.__proto__ = new controller();

module.exports = ForgetPassword;