/*************************************
* User Dashboard Controller
*************************************/

var RemoteController = function(){

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {
			Res.render('remote'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, room: Req.session.token, url:url});		
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}
}

RemoteController.__proto__ = new controller();

module.exports = RemoteController;