/*******************************
* Manage Device Model
* Add New Device, Update Device 
* and Delete Device
******************************/

 var ManageDeviceModel = function(){

 	// add new device
 	this.addDevice = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);

			var schema = model({
				userid: data.userId,
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

 	// update device status
 	this.changeModuleStatus = function(data, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);

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
 	this.deleteDevice = function(data, cb){

 		var fs = require('fs');

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);

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
 	this.getDeviceInfo = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);

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
 	this.updateDevice = function(data, cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/deviceSchema').DeviceSchema(mongoose);

			model.update({ _id: data.id },{
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

}

ManageDeviceModel.__proto__ = new model;

module.exports = ManageDeviceModel;