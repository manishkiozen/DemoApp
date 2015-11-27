/*************************************
* Action Controller
*************************************/

var DeviceController = function(){
	
	var actions_model;
	var model = require('../models/actions-model');
	actions_model = new model();


	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			// get all actions list
			actions_model.getActionsList(function(err, result){

				if(err){
					throw err;
				}
				else{

					var msg = '';
					if(Req.session.msg){
						msg = Req.session.msg;
						Req.session.msg = '';;
					}

					var actions = [];
					
					if( result.length > 0 ){

						result.forEach(function(elem, key){
							
							// prepare dataTable array
							var data = [ (key+1), elem.name, elem.sensorName, elem.functions, elem.operators, elem.value, '<a href="'+url+'/actions/editAction/?token=kiox'+elem._id+'&d='+elem._id+'" class="edit-action">Edit</a>', '<a href="#" class="delete-action" data-id="'+elem._id+'">Delete</a>'];
							actions.push(data);

							//check if array end then render data at page
							if( (key+1) == result.length){
								// render dashboard page	
								Res.render('actions-list'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, actions: actions, url:url, msg: msg});
								Res.end();
							}	
						});
					}
					else{
						// render dashboard page	
						Res.render('actions-list'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, actions: actions, url:url, msg: msg});
						Res.end();
					}
					
				}
			});

		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}

	this.addAction = function(){

		// check authentication of user login
		if (Req.session.userId) {

			var sensors_model;
			var model = require('../models/sensors-model');
			sensors_model = new model();

			// get user information
			sensors_model.getSensorsList(function(err, result){

				if(err){
					throw err;
				}
				else{

					// render dashboard page	
					Res.render('actions'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, sensors: result, url:url});
					Res.end();
				}
			});

		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}

	// check action name 
	this.checkActionName = function(){

		actions_model.checkActionName( Req.body, function(err, result){
			if(err){
				throw err;
			}
			else{

				if(result.length > 0){
					Res.send('1');
				}
				else{
					Res.send('0');
				}
				
				Res.end();
			}
		});
	}

	// create new action
	this.createAction = function(){

		// check authentication of user login
		if (Req.session.userId) {

			//var id = '561511186008cbc43cf99bf5';
			actions_model.createAction( Req.body, function(err, result){
				if(err){
					throw err;
				}
				else{
					
					if(result){
						Req.session.msg = 'Action create successfully!';
					}
					else{
						Req.session.msg = 'Action could not created!';
					}

					Res.redirect('/actions');
					Res.end();
				}
			});
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}

	// get actions information according sensors
	this.getActions = function(){
		var id = Req.body.sensorId;

		actions_model.getActions(id, function(err, result){
			if(err){
				throw err;
			}
			else{

				Res.send(result);
				Res.end();
			}
		});
	}

	// delete action 
	this.editAction = function(){
		
		// check authentication of user login
		if (Req.session.userId) {

			// prepare token
			var token = 'kiox'+Req.query.d;

			if(token == Req.query.token){
			
				var async = require('async');

				var sensors_model, sensors, action;
				var model = require('../models/sensors-model');
				sensors_model = new model();

				async.waterfall([
					function(cb){
						// get user information
						sensors_model.getSensorsList(function(err, result){
							if(err){
								throw err;
								cb(err);
							}
							else{
								sensors = result;
								cb(null);
							}
						});
					},
					function(cb){
						// delete action
						actions_model.getActionsInfo(Req.query.d, function(err, result){
							if(err){
								throw err;
								cb(err);
							}
							else{
								action = result;
								cb(null);
							}
						});
					}

					], function(err){
						// check error
						if(err){
							throw err;
						}

						// render dashboard page	
						Res.render('edit-actions'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, sensors: sensors, action: action, url:url});
						Res.end();
				});

			}
			else{
				Req.session.msg = 'Token is mismatch';
				Res.redirect('/actions');
				Res.end();
			}	

		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}

	// update action information
	this.updateAction = function(){

		// check authentication of user login
		if (Req.session.userId) {

			//var id = '561511186008cbc43cf99bf5';
			actions_model.updateAction( Req.body, function(err, result){
				if(err){
					throw err;
				}
				else{
					
					if(result){
						Req.session.msg = 'Action update successfully!';
					}
					else{
						Req.session.msg = 'Action could not updated!';
					}

					Res.redirect('/actions');
					Res.end();
				}
			});

		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}

	// delete action 
	this.deleteAction = function(){
		
		// check authentication of user login
		if (Req.session.userId) {

			// prepare token
			var token = 'kiox'+Req.query.d;

			if(token == Req.query.token){
				
				// delete action
				actions_model.deleteAction(Req.query.d, function(err, result){
					if(err){
						throw err;
					}
					else{
						
						if(result){
							Req.session.msg = 'Action delete successfully!';
						}
						else{
							Req.session.msg = 'Action could not deleted!';
						}

						Res.redirect('/actions');
						Res.end();
					}
				});
				
			}
			else{
				Req.session.msg = 'Token is mismatch';
				Res.redirect('/actions');
				Res.end();
			}							
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}
}

DeviceController.__proto__ = new controller();

module.exports = DeviceController;