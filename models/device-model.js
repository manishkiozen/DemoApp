/*******************************
* Manage Device Model
* Add New Device, Update Device 
* and Delete Device
******************************/

 var DeviceModel = function(){

 	// get device information
 	this.getDevices = function(userId, cb){

 		// get dashboard model object
 		var dashboard_model;
		var model = require('./dashboard-model');
		dashboard_model = new model();
		// get user information
		dashboard_model.getDevices(userId, function(err, result){
			if(err){
				cb(err, null);
			}
			else{
				cb(null, result);
			}
		});	
 	}

 	this.createThing = function(data, cb){

 		getConnection(function(mongoose){

			// create member  
			var model = require('../database/thingSchema').ThingSchema(mongoose);
			
			
			var schema = model({
				thingName: data.thingName,
				device: data.device,
				modules: data.modules,
				sensors: data.sensors,
				actions: [],
				alarms: [],
				analytics: [],
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


	// get thing information
	this.getThingInfo = function(id, cb){
		
		getConnection(function(mongoose){

			// create member  
			var model = require('../database/thingSchema').ThingSchema(mongoose);

			model.findOne({_id: id}, function(err, result){
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

DeviceModel.__proto__ = new model;

module.exports = DeviceModel;