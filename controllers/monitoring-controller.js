/*************************************
* Monitoring Controller
*************************************/

var MonitorController = function(){
	
	// check action name 
	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			// render dashboard page 	
			Res.render('monitoring'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, url:url });	
			Res.end();

			
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}
}

MonitorController.__proto__ = new controller();

module.exports = MonitorController;