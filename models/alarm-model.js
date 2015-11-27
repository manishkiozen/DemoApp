/*******************************
* Manage Alarm with things Model
******************************/

var AlarmModel = function(){


	// get all actions list
 	this.getAlarmList = function(cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);
			
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

 	// check exists alarm name
 	this.checkAlarmName = function(alarmName, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);
			
			model.find({name: alarmName}, function(err, result){
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

 	// get created function information
 	this.getAlarmInfo = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);

			model.findOne( { _id: id }, function(err, result){	
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
 	
	// set new alarm
 	this.setAlarm = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);

			var schema = model({
				name: data.alarmName,
				sensors: data.sensorId,
				sensorsName: data.sensorName,
				action: data.action,
				actionsName: data.actionName,
				condition: data.condition,
				time_value: data.time_value,
				time: data.time,
				calltoaction: data.callActionName,
				aletby: data.aletby,
				dateTime: getDateTime()
			});

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

			//var ObjectId = mongoose.Types.ObjectId;
		});			
 	}

 	// update alarm
 	this.updateAlarm = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);

			model.update( {_id: data.d}, {
				name: data.alarmName,
				sensors: data.sensorId,
				sensorsName: data.sensorName,
				action: data.action,
				actionsName: data.actionName,
				condition: data.condition,
				time_value: data.time_value,
				time: data.time,
				calltoaction: data.callActionName,
				aletby: data.aletby
			}, function(err, result){
				// close connection
				closeConnection(mongoose);

				if(err){
					cb(err, null);
				}
				else{
					cb(null, result);
				}
			});

			//var ObjectId = mongoose.Types.ObjectId;
		});			
 	}

 	// delete alarm 
 	this.deleteAlarm = function(id, cb){
 		
 		getConnection(function(mongoose){
	 		
	 		// get schema object
			var model = require('../database/alarmSchema').AlarmSchema(mongoose);

			model.remove( {_id: id}, function(err, result){
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

AlarmModel.__proto__ = new model;

module.exports = AlarmModel;