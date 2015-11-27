/*************************************
* Sensors Controller
*************************************/

var SensorsController = function(){
	
	var sensors_model;
	var model = require('../models/sensors-model');
	sensors_model = new model();

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			var msg = (Req.session.msg)? Req.session.msg : '';

			// get user information
			sensors_model.getSensorsList(function(err, result){
				if(err){
					throw err;
				}
				else{
					
					if(msg != ''){
						Req.session.msg = '';
					}

					// render dashboard page 	
					Res.render('sensors-list'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, sensors:result, url:url, error: false, msg: msg });	
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

	// add new sensor information
	this.addNew = function(){

		// check authentication of user login
		if (Req.session.userId) {
			var msg = (Req.session.msg)? Req.session.msg : '';

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
					Res.render('add-sensors'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, device: result, url:url, error: false, msg: msg });	
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

	this.getModulesSensors = function(){
		//Req.body.mod.join('-')+'kioxApp'
		var mod = JSON.parse(Req.body.mod);
		var token =mod.join('-')+'kioxApp';

		Req.session.addThing.modules = mod; //store device information into session

		if (Req.session.userId) {
			// get device module information
			sensors_model.getModulesSensors( Req.session.addThing.device, function(err, sensors){
				if(err){
					Res.send({msg:err, staus:0});
				}
				else{
					Res.send({data:sensors, staus:1});
					Res.end();
				}				
			});
		}
		else{
			// redirect to login page if user not authorise
			Res.send({msg:'logout', staus:0});
			Res.end();
		}	
	}

	// add new sensor 
	this.addSensor = function(){
		
		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName, deviceId, deviceName, sensorName, validFlag;
			var Busboy = require('busboy'), fs = require('fs');

			var busboy = new Busboy({ headers: Req.headers });
		    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		    	var allow_files = Object.keys(allowFiles);

		    	// check file mime type
		    	if( allow_files.indexOf(mimetype) != -1 ){

		    		if (!Date.now) {
				    	Date.now = function() { return new Date().getTime(); }
					}

					var filename = Math.floor(Date.now() / 1000)+'.'+allowFiles[mimetype];
					fileName = filename;
			      	validFlag = true;
			      	file.pipe(fs.createWriteStream('./'+resource+'/'+fileUploads+filename));
		    	}
		    	else{    		
		    		validFlag = false;	
		    	}
		    	
		    });

			busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
		     	
				 if( fieldname == 'deviceId' ){
				 	deviceId = val;
				 }
				 else if( fieldname == 'deviceName' ){
				 	deviceName = val;
				 }	
				 else if( fieldname == 'sensorName' ){
				 	sensorName = val;
				 }
		      
		    });

		    busboy.on('finish', function() {
		    	
		    	if(validFlag){ // check malacious file

		    		sensors_model.addSensor({name:sensorName, deviceName: deviceName, deviceId: deviceId, file:fileUploads+fileName, date:currentDateTime}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Add sensor successfully!';	
								Res.redirect('/sensors');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Sensor could not add successfully!';	
								Res.redirect('/sensors');
							}
						}
						Res.end();
					});

		    	}
		    	else{

		    		Res.redirect('sensors/addNew');	
					Res.end();
		    	}
		    	
		    });

		    return Req.pipe(busboy);
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}

	 	Res.end();
	}

	this.changeSensorStatus = function(){

		var id = Req.query.d;
		var status = Req.query.s;
		var token = Req.query.d+'kioxApp'+status;

		if( token == Req.query.token && Req.session.userId ){

			// change status 
			status = (status == 'true')? false : true;
			
			sensors_model.changeSensorStatus({id:id, status:status}, function(err, result){
				if(err){
					throw err;
					return;
				}
				// set message after update 
				Req.session.msg = 'Status has been changed successfully!';
				Res.redirect('/sensors');	
				Res.end();
			});
		}
		else{
			// set message after update 
			Req.session.msg = 'Token is not valid';
			Res.redirect('/sensors');
			Res.end();
		}	
	}

	this.deleteSensor = function(){

		var id = Req.query.d;
		var img = Req.query.img;

		sensors_model.deleteSensor({id:id, img:img}, function(err, result){
			if(err){
				throw err;
				return;
			}
			else{
				if(result){
					// set message after update 
					Req.session.msg = 'Sensor has been deleted successfully!';
				}
				else{
					// set message after update 
					Req.session.msg = 'Sensor could not deleted';
				}
		
				// redirect page
				Res.redirect('/sensors');	
				Res.end();
			}
			
			
		});
	}

	// edit device
	this.editSensor = function(){

		var id = Req.query.d;
		var token = Req.query.d+'kioxApp';

		var async = require('async');

		if( token == Req.query.token && Req.session.userId ){
			
			var dashboard_model;
			var model = require('../models/dashboard-model');
			dashboard_model = new model();

			var devices, sensor='';

			async.waterfall([
					function(callback){
						// get user information
						dashboard_model.getDevices(Req.session.userId, function(err, result){
							if(err){
								callback(err);
								return;
							}
							else{
								devices = result;
								callback(null);
							}
						});		
					},

					function(callback){
						sensors_model.getSensorInfo(id, function(err, result){
							if(err){
								callback(err);
								return;
							}

							sensor = result

							callback(null);
						});
					}

				], function(err){

					if(err){
						throw err;
					}
					else{

						if(sensor != ''){
							var error = (Req.session.msg)? Req.session.msg : false;
							Res.render('edit-sensor'+fileExt, {data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, device: devices, sensors: sensor, url:url, error: error });
						}
						else{
							Req.session.msg = 'Sorry, module data not found';
							Res.redirect('/sensors');	
						}

						Res.end(); // response end
					}
			});
			
		}
		else{
			// set message after update 
			Req.session.msg = 'Token is not valid';
			Res.redirect('/sensors');
			Res.end();
		}	

	}

	// update sensor information
	this.updateSensor = function(){

		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName='', sensorName, deviceId, deviceName, validFlag, oldImg, id, fileFlag;
			var Busboy = require('busboy'), fs = require('fs');

			var busboy = new Busboy({ headers: Req.headers });
		    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

		    	fileFlag = filename;

		    	var allow_files = Object.keys(allowFiles);

		    	// check file mime type
		    	if( allow_files.indexOf(mimetype) != -1 && fileFlag != undefined){

		    		if (!Date.now) {
				    	Date.now = function() { return new Date().getTime(); }
					}

					var filename = Math.floor(Date.now() / 1000)+'.'+allowFiles[mimetype];
					fileName = fileUploads+filename;
			      	validFlag = true;
			      	file.pipe(fs.createWriteStream('./'+resource+'/'+fileUploads+filename));
		    	}
		    	else{  
		    		if(file.length > 0){
		    			validFlag = false;	
		    		}  		
		    		else{
		    			validFlag = true;
		    		}
		    	}
		    	
		    });

			busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
		      
			  if( fieldname == 'deviceId'){
			  	deviceId = val;
			  }		
		      else if(fieldname == 'sensorName'){
		      	sensorName = val;
		      } 
		      else if(fieldname == 'deviceName'){
		      	deviceName = val;
		      }
		      else if(fieldname == 'd'){
		      	id = val;
		      }
		      else if(fieldname == 'img'){
		      	oldImg = val;

		      	// update device information if image not uplaod
		      	if(validFlag && fileFlag == undefined || fileFlag == ''){

		      		fileName = oldImg;

		    		sensors_model.updateSensor({name:sensorName, deviceName: deviceName, deviceId: deviceId, file:fileName, date:currentDateTime, id: id, image: oldImg, imgFlag: true}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update sensor successfully!';	
								Res.redirect('/sensors');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Sensor could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/sensors/editSensor/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});
		      	}
		      }
		      	
		    });

		    busboy.on('finish', function() {

		    	if(validFlag){ // check malacious file

		    		sensors_model.updateSensor({name:sensorName, deviceName: deviceName, deviceId: deviceId, file:fileName, date:currentDateTime, id: id, image: oldImg, imgFlag: false}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update sensor successfully!';	
								Res.redirect('/sensors');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Sensor could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/sensors/editSensor/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});

		    	}
		    	else{
		    		Req.session.msg = 'Sensor icon could not upload!';
		    		var token = id+'kioxApp';	
					Res.redirect('/sensors/editSensor/?token='+token+'&d='+id);
					Res.end();
		    	}
		    	
		    });

		    return Req.pipe(busboy);
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}

	 	Res.end();
	}
}

SensorsController.__proto__ = new controller();

module.exports = SensorsController;