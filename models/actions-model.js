/***************************
* action model
* Actions information
***************************/

 var ActionsModel = function(){

 	// get all actions list
 	this.getActionsList = function(cb){

 		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/actionSchema').ActionSchema(mongoose);
			
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

 	// add action name
 	this.checkActionName = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member  .actionName
			var obj = {name: data.actionName};

			// check id 
			if(data.hasOwnProperty('id')){
				obj._id = {"$ne": data.id };
			}

			console.log('obj=>'+JSON.stringify(obj))
			var model = require('../database/actionSchema').ActionSchema(mongoose);
			
			model.find(obj, function(err, result){
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

 	// create action
 	this.createAction = function(data, cb){
	
		getConnection(function(mongoose){
			
			// create member 
			var model = require('../database/actionSchema').ActionSchema(mongoose);

			var schema = model({
				name: data.actionName,
				sensorId: data.sensorId,
				sensorName: data.sensorName,
				functionId: data.functions,
				functions: data.functionName,
				operators: data.operators,
				value: data.value,
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

		});			
 	}

 	// update action name
 	this.updateAction = function(data, cb){
	
		getConnection(function(mongoose){
			
			var model = require('../database/actionSchema').ActionSchema(mongoose);
			
			model.update({ _id: data.d },{
					name: data.actionName,
					sensorId: data.sensorId,
					sensorName: data.sensorName,
					functionId: data.functions,
					functions: data.functionName,
					operators: data.operators,
					value: data.value,
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

		});			
 	}

 	// get created function information
 	this.getActionsInfo = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/actionSchema').ActionSchema(mongoose);

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

 	// get created function information
 	this.getActions = function(id, cb){

 		getConnection(function(mongoose){

			// create member 
			var model = require('../database/actionSchema').ActionSchema(mongoose);

			//model.find( {'actions.data.sensorId': id}, {'actions.$':1}, function(err, result){
			model.find( { sensorId: id }, function(err, result){	
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

 	// delete action 
 	this.deleteAction = function(id, cb){
 		
 		getConnection(function(mongoose){
	 		
	 		// get schema object
			var model = require('../database/actionSchema').ActionSchema(mongoose);

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

ActionsModel.__proto__ = new model;

module.exports = ActionsModel;