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
}