
module.exports = {
	
	connect : function(cb){

		var connectionFlag = false;
		var config = connections[ connections.defaultConnection ]; // get configuration

		switch( connections.defaultConnection ){
			
			// establish connection with mongodb in default or mongodb 
			case 'default':
			case 'mongoDb':

				var mongoose = require('mongoose'); // use mongoose for mongodb

				// connect mongoose database
				mongoose.connect('mongodb://'+config.host + '/' + config.databaseName);
				
				// store mongoose object in promise resolve
				cb(null, mongoose);

				connectionFlag = true;

				break;	

		}

		// check connection. if connection faild then store null in rejection
		if( connectionFlag === false ){
			cb(true, null); // reject if connection could not establish
		}
	}
}