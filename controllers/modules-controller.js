/*************************************
* Modules controller
*************************************/

var ModulesController = function(){
	
	var modules_model;
	var model = require('../models/modules-model');
	modules_model = new model();

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			var msg = (Req.session.msg)? Req.session.msg : '';

			// get user information
			modules_model.getModulesList(function(err, result){
				if(err){
					throw err;
				}
				else{
					
					if(msg != ''){
						Req.session.msg = '';
					}

					// render dashboard page 	
					Res.render('modules-list'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, modules:result, url:url, error: false, msg: msg });	
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

	// add new module information
	this.addNew = function(){

		// check authentication of user login
		if (Req.session.userId) {
			var msg = (Req.session.msg)? Req.session.msg : '';

			var dashboard_model;
			var model = require('../models/dashboard-model');
			dashboard_model = new model();

			dashboard_model.getDevices(Req.session.userId, function(err, result){
				if(err){
					throw err;
				}
				else{
					// render page
					Res.render('add-module'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, device: result, url:url, error: false, msg: msg });	
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

	this.getDeviceModules = function(){

		if (Req.session.userId) {
			// get device module information //Req.body.d, Req.session.userId 
			Req.session.addThing = {};
			Req.session.addThing.device = Req.body.d; //store device information into session

			modules_model.getDeviceModules(Req.body.d, function(err, modules){
				if(err){
					throw err;
				}
				else{
					Res.send({data:modules, staus:1});
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

	// add new module 
	this.addModule = function(){
		
		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName, moduleName, deviceId, validFlag, deviceName;
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
		      // get field name value
		      if( fieldname == "deviceId"){
		      	deviceId = val;
		      }
		      else if( fieldname == "deviceName"){
		      	deviceName = val;
		      }
		      else if( fieldname == "moduleName"){
		      	moduleName = val;	      	
		      }	      
		      
		    });

		    busboy.on('finish', function() {
		    	
		    	if(validFlag){ // check malacious file

		    		modules_model.addModule({name:moduleName, deviceName: deviceName, deviceId:deviceId, file:fileUploads+fileName, date:currentDateTime}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Add module successfully!';	
								Res.redirect('/modules');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Module could not add successfully!';	
								Res.redirect('/modules');
							}
						}
						Res.end();
					});

		    	}
		    	else{
		    		var msg = '';
		    		Res.render('add-module'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, url:url, error: false, msg: msg });	
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


	//change module status
	this.changeModuleStatus = function(){
		
		var id = Req.query.d;
		var status = Req.query.s;
		var token = Req.query.d+'kioxApp'+status;

		if( token == Req.query.token && Req.session.userId ){

			// change status 
			status = (status == 'true')? false : true;
			
			modules_model.changeModuleStatus({id:id, status:status}, function(err, result){
				if(err){
					throw err;
					return;
				}
				// set message after update 
				Req.session.msg = 'Status has been changed successfully!';
				Res.redirect('/modules');	
				Res.end();
			});
		}
		else{
			// set message after update 
			Req.session.msg = 'Token is not valid';
			Res.redirect('/dashboard');
			Res.end();
		}		
	}

	// delete devices
	this.deleteModule = function(){
		var id = Req.query.d;
		var img = Req.query.img;

		modules_model.deleteModule({id:id, img:img}, function(err, result){
			if(err){
				throw err;
				return;
			}
			else{
				if(result){
					// set message after update 
					Req.session.msg = 'Module has been deleted successfully!';
				}
				else{
					// set message after update 
					Req.session.msg = 'Module could not deleted';
				}
		
				// redirect page
				Res.redirect('/modules');	
				Res.end();
			}
			
			
		});
	}

	// edit device
	this.editModule = function(){

		var id = Req.query.d;
		var token = Req.query.d+'kioxApp';

		var async = require('async');

		if( token == Req.query.token && Req.session.userId ){

			var dashboard_model;
			var model = require('../models/dashboard-model');
			dashboard_model = new model();
			var devices, module='';

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
						modules_model.getModuleInfo(id, function(err, result){
							if(err){
								callback(err);
								return;
							}
							module = result

							callback(null);
						});
					}

				], function(err){

					if(err){
						throw err;
					}
					else{

						if(module != ''){
							var error = (Req.session.msg)? Req.session.msg : false;
							Res.render('edit-module'+fileExt, {data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, device: devices, modules: module, url:url, error: error });
						}
						else{
							Req.session.msg = 'Sorry, module data not found';
							Res.redirect('/modules');	
						}

						Res.end(); // response end
					}
			});
			
		}
		else{
			// set message after update 
			Req.session.msg = 'Token is not valid';
			Res.redirect('/modules');
			Res.end();
		}	

	}

	// update module information
	this.updateModule = function(){

		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName='', moduleName, deviceId, deviceName, validFlag, oldImg, id, fileFlag;
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
		      
		      if(fieldname == 'deviceId'){
		      	deviceId = val;
		      }
		      else if(fieldname == 'moduleName'){
		      	moduleName = val;
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

		    		modules_model.updateModule({ name:moduleName, file:fileName, deviceName:deviceName, deviceId: deviceId, date:currentDateTime, id: id, image: oldImg, imgFlag: true}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update module successfully!';	
								Res.redirect('/modules');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Module could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/modules/editModule/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});
		      	}
		      }
		      	
		    });

		    busboy.on('finish', function() {

		    	if(validFlag){ // check malacious file

		    		modules_model.updateModule({ name:moduleName, file:fileName, deviceName:deviceName, deviceId: deviceId, date:currentDateTime, id: id, image: oldImg, imgFlag: false}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update module successfully!';	
								Res.redirect('/modules');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Module could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/modules/editModule/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});

		    	}
		    	else{
		    		Req.session.msg = 'Module icon could not upload!';
		    		var token = id+'kioxApp';	
					Res.redirect('/managedevice/editModule/?token='+token+'&d='+id);
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

ModulesController.__proto__ = new controller();

module.exports = ModulesController;