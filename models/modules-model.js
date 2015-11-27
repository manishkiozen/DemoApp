/***************************
* Modules Model
* Get module information
***************************/

 var ModulesModel = function(){

 	this.getModuless = function(cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

			// get modules information
			model.find({},function(err, result){
				
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

 	// add new module
 	this.addModule = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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
 	this.getModulesList = function(cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);
			
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

 	// get module according device //devices, userid,
	this.getDeviceModules = function(deviceId, cb){
		

 		getConnection(function(mongoose){

			// create member  device_id: devices, userid: userid 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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

	// update device status 
 	this.changeModuleStatus = function(data, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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
 	this.deleteModule = function(data, cb){

 		var fs = require('fs');

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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

 	// get device information
 	this.getModuleInfo = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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

 	// update device information
 	this.updateModule = function(data, cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

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

 	this.getModulesInfo = function(modules, cb){

 		getConnection(function(mongoose){
	 		// create member 
			var model = require('../database/moduleSchema').ModuleSchema(mongoose);

			model.find({ _id: { $in: modules } }, function(err, result){
				
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

ModulesModel.__proto__ = new model;

module.exports = ModulesModel;