/*************************************
* User Dashboard Controller
*************************************/

var DashboardController = function(){
	
	var dashboard_model;
	var model = require('../models/dashboard-model');
	dashboard_model = new model();

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			var msg='';
			if(Req.session.msg){
				msg = Req.session.msg;
				Req.session.msg = null;
			}

			// get user information
			dashboard_model.getDevices(Req.session.userId, function(err, result){
				if(err){
					throw err;
				}
				else{
					// render dashboard page	
					Res.render('dashboard'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, device: result, url:url , msg: msg});
				}
			});		
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}

	// logout session
	this.logout = function(){
		// destroy session
		Req.session.destroy(function(err){
			if(err){
				throw err; 
			}
			else
			{
				// redirect at login page
				Res.redirect('/login');
			}
		});
	}
}

DashboardController.__proto__ = new controller();

module.exports = DashboardController;