/***************************
* Modules Model
* Get module information
***************************/

 var SensorsModel = function(){

 	// get module according device
	this.getModulesSensors = function(deviceId, cb){
		
		getConnection(function(mongoose){

			// create member  
			var model = require('../database/sensorSchema').SensorSchema(mongoose);
			
			model.find({device_id: deviceId}, function(err, result){

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

	// add new sensor
 	this.addSensor = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			var schema = model({
				device_id: data.deviceId,
				deviceName: data.deviceName,
				name: data.name,
				image: data.file,
				dateTime: data.date
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

	// get modules list
 	this.getSensorsList = function(cb){

 		getConnection(function(mongoose){

			// create member  
			var model = require('../database/sensorSchema').SensorSchema(mongoose);
			
			model.find({}, function(err, result){

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

 	// update device status 
 	this.changeSensorStatus = function(data, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			model.update({ _id: data.id },{status: data.status}, function(err, result){
				
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

 	// delete device
 	this.deleteSensor = function(data, cb){

 		var fs = require('fs');

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			model.remove({ _id: data.id }, function(err, result){

				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{

					// remove image file of device
					var filePath = './public/'+data.img;
					fs.unlink(filePath);
					
					cb(null, result);
				}								
			});
		});	
 	}

 	// get sensor information
 	this.getSensorInfo = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			model.findOne({ _id: id }, function(err, result){
				
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

 	// update sensor information
 	this.updateSensor = function(data, cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			model.update({ _id: data.id },{
					device_id: data.deviceId,
					deviceName: data.deviceName,
					name: data.name, 
					image: data.file, 
					dateTime: data.date
				}, function(err, result){
				
				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{
					// remove image file of device
					if(data.imgFlag == false){
						var fs = require('fs');
						var filePath = './public/'+data.image;
						fs.unlink(filePath);
					}
					
					cb(null, result);
				}
			});
		});
 	}

 	this.getSensorsInfo = function(sensors, cb){

 		getConnection(function(mongoose){
	 		// create member 
			var model = require('../database/sensorSchema').SensorSchema(mongoose);

			model.find({ _id: { $in: sensors } }, function(err, result){
				
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

SensorsModel.__proto__ = new model;

module.exports = SensorsModel;