module.exports = function(){

	init = function(cb){
		// get mongoose module with connection
		var db = require('../lib/connection').connect(function(err, conn){
			if(err){
				throw new Error('Connection could not establish with database \n');
			}
			else{
				cb(conn);
			}
		});
	}	
	
	
	// get connection object
	getConnection = function(cb){
		init(function(dbConn){
			cb(dbConn);
		});		
	}

	closeConnection = function(mongoose){
		mongoose.connection.close()
	}

	getDateTime = function(){
		var d = new Date();
		var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDay();
		var time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		return date+' '+time;
	}
}