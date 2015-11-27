/*********************************************
* Local System monitoring Model
* Store Local System monitoring information
*********************************************/
var modelSchema = '';

 var LocalSysMonitorModel = function(){

 	this.saveMonitoring = function(userid, data, cb){

 		getConnection(function(mongoose){
			
			// create member 
			if( modelSchema == '' ){
				modelSchema = require('../database/localSysSchema').LocalSysSchema(mongoose);
			}
						
			var schema = modelSchema({
				userid: userid,
				data: data,
				dateTime: getDateTime()
			});

			// save new member information
			schema.save(function(err, result){

				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{
					cb(null, result);
				}				
			});

		});	
 	}
}

LocalSysMonitorModel.__proto__ = new model;

module.exports = LocalSysMonitorModel;