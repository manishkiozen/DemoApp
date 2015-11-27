// include local system module
var localSys_model;
var model = require('../models/localSysMonitor-model');
localSys_model = new model();

module.exports = {

	socketStart: function(){

		io.on('connection', function (socket) {

			console.log('connection established');	

			// authenticate login user
			socket.on('authUser', function(userData, cb){
				console.log('userData=>'+JSON.stringify(userData))
				var login_model;
				var model = require('../models/login-model');
				login_model = new model();


				// login user with his credential 
				login_model.userLogin(userData, function(err, result){

					if( err ){
						throw err;
					}
					else{

						if( result ){
							console.log('result._id=>'+result._id)
							socket.join(result._id);
							cb(null, result._id);
						}
						else{
							console.log('User could not authenticate \n');
							cb('User not found', null);
						}						
					}
				});

			});

			// join room
			socket.on('joinRoom', function(room){
				socket.join(room);
			});

			// get clint execute command
			socket.on('remoteCommand', function(command, fn){
				
				// send command to client device
				io.to(Req.session.userId).emit('command', command);
				fn(true);
			});

			// send command status to remote user
			socket.on('commandStatus', function(status){
				socket.to(Req.session.token).emit('commandStatus', status);
			});

			// send command status to remote user
			socket.on('machineMonitoring', function(userid, monitorData, fn){
				console.log('machineMonitoring=>'+userid);
				// save local machine performance
				localSys_model.saveMonitoring(userid, monitorData, function(err, result){
					if(err){
						//console.log('error=>'+err);
						fn(err, null);
					}
					else{
						fn(null, result);
					}
				});
			});	

		});
	}
}