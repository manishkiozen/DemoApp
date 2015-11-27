/*************************************
* Alert controller
*************************************/

var AlarmController = function(){
	
	var alarm_model;
	var model = require('../models/alarm-model');
	alarm_model = new model();

	this.index = function(){

		//check authentication of user login
		if (Req.session.userId) {
			
			// get all actions list
			alarm_model.getAlarmList(function(err, result){

				if(err){
					throw err;
				}
				else{

					var msg = '';
					if(Req.session.msg){
						msg = Req.session.msg;
						Req.session.msg = '';;
					}

					var alarms = [];
					
					if( result.length > 0 ){

						result.forEach(function(elem, key){
							
							// prepare dataTable array
							var data = [ (key+1), elem.name, elem.sensorsName, elem.actionsName, elem.condition, elem.time+', '+elem.time_value, elem.aletby, '<a href="'+url+'/alarm/editAlarm/?token=kiox'+elem._id+'&d='+elem._id+'" class="edit-action">Edit</a> <br /> <a href="#" class="delete-action" data-id="'+elem._id+'">Delete</a>'];
							alarms.push(data);

							//check if array end then render data at page
							if( (key+1) == result.length){
								// render dashboard page	
								Res.render('alarms-list'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, alarms: alarms, url:url, msg: msg});
								Res.end();
							}	
						});
					}
					else{
						// render dashboard page	
						Res.render('alarms-list'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, alarms: alarms, url:url, msg: msg});
						Res.end();
					}
					
				}
			});								
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}

	// set new alarm
	this.addAlarm = function(){

		//check authentication of user login
		if (Req.session.userId) {

			var msg = (Req.session.msg)? Req.session.msg : '';
			
			var sensors_model;
			var model = require('../models/sensors-model');
			sensors_model = new model();

			// get user information
			sensors_model.getSensorsList(function(err, result){
				if(err){
					throw err;
				}
				else{
					// // render dashboard page 	
					Res.render('alarm'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, sensors: result, url:url, error: false, msg: msg });	
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

	// check alarm name 
	this.checkAlarmName = function(){

		alarm_model.checkAlarmName( Req.body.alarmName, function(err, result){
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

	this.setAlarm = function(){

		if (Req.session.userId) {

			var data = Req.query;

			// set alarm
			alarm_model.setAlarm( data, function(err, result){
				if(err){
					throw err;
				}
				else{

					if(result){
						Req.session.msg = 'Alarm set successfully!';
					}
					else{
						Req.session.msg = 'Alarm could not set';
					}

					Res.redirect('/alarm');
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

	// edit Alarm
	this.editAlarm = function(){
		
		// check authentication of user login
		if (Req.session.userId) {

			// prepare token
			var token = 'kiox'+Req.query.d;

			if(token == Req.query.token){
			
				var async = require('async');

				var sensors_model, sensors, alarm;
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
						alarm_model.getAlarmInfo(Req.query.d, function(err, result){
							if(err){
								throw err;
								cb(err);
							}
							else{
								alarm = result;
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
						Res.render('edit-alarm'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, sensors: sensors, alarm: alarm, url:url});
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

	// update alarm
	this.updateAlarm = function(){

		if (Req.session.userId) {

			var data = Req.query;

			//console.log(JSON.stringify(data))
			//set alarm
			alarm_model.updateAlarm( data, function(err, result){
				if(err){
					throw err;
				}
				else{

					if(result){
						Req.session.msg = 'Alarm update successfully!';
					}
					else{
						Req.session.msg = 'Alarm could not updated!';
					}

					Res.redirect('/alarm');
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

	// delete action 
	this.deleteAlarm = function(){
		
		// check authentication of user login
		if (Req.session.userId) {

			// prepare token
			var token = 'kiox'+Req.query.d;

			if(token == Req.query.token){
				
				// delete action
				alarm_model.deleteAlarm(Req.query.d, function(err, result){
					if(err){
						throw err;
					}
					else{
						
						if(result){
							Req.session.msg = 'Alarm delete successfully!';
						}
						else{
							Req.session.msg = 'Alarm could not deleted!';
						}

						Res.redirect('/alarm');
						Res.end();
					}
				});
				
			}
			else{
				Req.session.msg = 'Token is mismatch';
				Res.redirect('/alarm');
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

AlarmController.__proto__ = new controller();

module.exports = AlarmController;