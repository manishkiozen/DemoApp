/*************************************
* device Controller
*************************************/

var DeviceController = function(){
	
	var device_model;
	var model = require('../models/device-model');
	device_model = new model();

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			var dashboard_model;
			var model = require('../models/dashboard-model');
			dashboard_model = new model();
			// get user information
			dashboard_model.getDevices(Req.session.userId, function(err, result){
				if(err){
					throw err;
				}
				else{
					// render dashboard page	
					Res.render('device'+fileExt, { data: {_id: Req.session.userId, name: Req.session.userName, image:Req.session.userImg}, device: result, url:url});
				}
			});		
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
		}
	}

	this.getSelectItemInfo = function(){
		if (Req.session.userId) {
			var sensor = JSON.parse(Req.body.sensor);
			Req.session.addThing.sensors = sensor; 
			 console.log( 'Req.session.addThing=>'+JSON.stringify(Req.session.addThing) );
			// Res.send('done');
			// Res.end();

			var async = require('async');
			var deviceData, modulesData, sensorsData;

			async.waterfall([
					function (cb){
						var manageDevice_model;
						var model = require('../models/managedevice-model');
						manageDevice_model = new model();

						manageDevice_model.getDeviceInfo(Req.session.addThing.device, function(err, result){
							if(err){
								cb(err);
								return;
							}
							
							deviceData = result;
							cb(null);
						});

					},
					function (cb){

						var modules_model;
						var model = require('../models/modules-model');
						modules_model = new model();

						modules_model.getModulesInfo(Req.session.addThing.modules, function(err, result){
							if(err){
								cb(err);
								return;
							}
							
							modulesData = result;
							cb(null);
						});
					},
					function (cb){

						var sensors_model;
						var model = require('../models/sensors-model');
						sensors_model = new model();

						sensors_model.getSensorsInfo(Req.session.addThing.sensors, function(err, result){
							if(err){
								cb(err);
								return;
							}
							
							sensorsData = result;
							cb(null);
						});
					}

				], 
				function(err){
					if(err){
						console.log('err=>'+err);
					}

					Res.render('connect-things'+fileExt, {device: deviceData, modules: modulesData, sensors: sensorsData,  url:url});
					deviceData = null;
					modulesData = null;
					sensorsData = null;

			});

		}
	}


	this.createThing = function(){

		var async = require('async');
		var data={};

		async.waterfall([
				function (cb){
					var manageDevice_model;
					var model = require('../models/managedevice-model');
					manageDevice_model = new model();

					manageDevice_model.getDeviceInfo(Req.session.addThing.device, function(err, result){
						if(err){
							cb(err);
							return;
						}
						
						data.device = {id: result._id, name: result.name };
						cb(null);
					});

				},
				function (cb){

					var modules_model;
					var model = require('../models/modules-model');
					modules_model = new model();

					modules_model.getModulesInfo(Req.session.addThing.modules, function(err, result){
						if(err){
							cb(err);
							return;
						}
						
						var modules = [];
						result.forEach(function(val, key){
							modules.push({id: val._id, name: val.name});

							if( (key+1) == result.length ){
								data.modules = modules;
								cb(null);
							}
						});
						
					});
				},
				function (cb){

					var sensors_model;
					var model = require('../models/sensors-model');
					sensors_model = new model();

					sensors_model.getSensorsInfo(Req.session.addThing.sensors, function(err, result){
						if(err){
							cb(err);
							return;
						}
						
						var sensors = [];
						result.forEach(function(val, key){
							sensors.push({id: val._id, name: val.name});

							if( (key+1) == result.length ){
								data.sensors = sensors;
								cb(null);
							}
						});						
					});
				}

			], 
			function(err){
				if(err){
					console.log('err=>'+err);
				}

				data.thingName= Req.body.thingName;

				// create thing
				device_model.createThing(data, function(err, result){
					if(err){
						throw err;
					}
					else{

						if(result){
							Res.send('Thing create successfully!');
							Res.end();
						}
						else{
							Res.send('Thing could not create!');
							Res.end();
						}

					}
				});				
		});	
	}
}

DeviceController.__proto__ = new controller();

module.exports = DeviceController;