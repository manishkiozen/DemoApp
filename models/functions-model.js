/***************************
* functions model
***************************/

 var FunctionsModel = function(){

 	// get all actions list
 	this.getFunctions = function(id, cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/functionsSchemas').FunctionSchemas(mongoose);
			model.find( {sensorId: id}, function(err, result){	
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

FunctionsModel.__proto__ = new model;

module.exports = FunctionsModel;