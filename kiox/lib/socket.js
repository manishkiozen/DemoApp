var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');
var child;
global.userID='';

module.exports = {
	init: function(){

		socket.on("connect", function(){
			console.log('socket connected \n');

			fs.readFile( process.cwd()+'/user.txt', function(err, data){
				if(err){
					throw err;
				}
				else{
					userID = data.toString().replace(/"/g,"");
					//console.log('userID=>'+userID);
				}
			});
		});
		
		// authenticate with server
		// socket.emit("authUser", { username: 'manish.kumar', password: '123456789' }, function(err, result){
		// 	if(err){
		// 		console.log('error=>'+err);
		// 	}
		// 	else{
		// 		userID = result;
		// 	}
		// });

		// get command from server
		socket.on("command", function(c){
			console.log('command=>'+c);

			// executes `pwd`
			child = exec(c, function (error, stdout, stderr) {
			  sys.print('stdout: ' + stdout);
			  sys.print('stderr: ' + stderr);
			  if (error !== null) {
			    console.log('exec error: ' + error);

			    // send error message to server
			    socket.emit('commandStatus', 'Command could not execute!');
			  }
			  else{
			  	socket.emit('commandStatus', 'Command execute successfully!');
			  }

			});

		});
		
		// get system performance
		setInterval(function(){
			
			// check userID
			if( userID != '' ){

				// executes `TOP Command

				child = exec('TERM=vt100 top -b -n 1', function (error, stdout, stderr) {
				  //sys.print('stdout: ' + stdout);
				  sys.print('stderr: ' + stderr);
				  if (error !== null) {
				    console.log('exec error in top: ' + error);
				  }
				  else{
				  	// check user id
				  	if( userID != '' ){
				  		socket.emit('machineMonitoring',userID, stdout, function(err, res){
				  			if(err){
				  				console.log('err=>'+JSON.stringify(err));
				  			}
				  			else{
				  				console.log('res=>'+res);
				  			}
					  	});
				  	}
				  	else{
				  		console.log('user id not found')
				  	}			  	
				  }

				});
			}			

		},30000);
	}
}
