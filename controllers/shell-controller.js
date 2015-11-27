/*************************************
* Shall command Controller
*************************************/

var ShellController = function(){
	
	this.index = function(){

		if( Req.session.userId ){

			var command = Req.query.c;
			io.to(Req.session.userId).emit('command', command);
			console.log('c=>'+command+'to=>'+Req.session.userId);			
		}
		else{
			Res.redirect('/login');
		}
		
		Res.end();
	}
}

ShellController.__proto__ = new controller();

module.exports = ShellController;