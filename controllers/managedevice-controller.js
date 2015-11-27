/*************************************
* Manage Device Controller 
*************************************/

var ManageDeviceController = function(){
	
	var managedevice_model;
	var model = require('../models/managedevice-model');
	managedevice_model = new model();

	this.index = function(){

		// check authentication of user login
		if (Req.session.userId) {

			// render dashboard page 	
			Res.render('add-device'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, url:url, error: false });	
			Res.end();
		}
		else{
			// redirect to login page if user not authorise
			Res.redirect('/login');
			Res.end();
		}
	}

	// add new device 
	this.addDevice = function(){
		
		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName, deviceName, validFlag;
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
		      deviceName = val;
		    });

		    busboy.on('finish', function() {
		    	
		    	if(validFlag){ // check malacious file

		    		managedevice_model.addDevice({userId: Req.session.userId, name:deviceName, file:fileUploads+fileName, date:currentDateTime}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Add device successfully!';	
								Res.redirect('/dashboard');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Device could not add successfully!';	
								Res.redirect('/managedevice');
							}
						}
						Res.end();
					});

		    	}
		    	else{
		    		Res.render('add-device'+fileExt, { data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, url:url, error: false });	
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

	this.changeDeviceStatus = function(){
		var id = Req.query.d;
		var status = Req.query.s;
		var token = Req.query.d+'kioxApp'+status;

		if( token == Req.query.token && Req.session.userId ){

			// change status 
			status = (status == 'true')? false : true;
			
			managedevice_model.changeDeviceStatus({id:id, status:status}, function(err, result){
				if(err){
					throw err;
					return;
				}
				// set message after update 
				Req.session.msg = 'Status has been changed successfully!';
				Res.redirect('/dashboard');	
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
	this.deleteDevice = function(){
		var id = Req.query.d;
		var img = Req.query.img;

		managedevice_model.deleteDevice({id:id, img:img}, function(err, result){
			if(err){
				throw err;
				return;
			}
			else{
				if(result){
					// set message after update 
					Req.session.msg = 'Device has been deleted successfully!';
				}
				else{
					// set message after update 
					Req.session.msg = 'Device could not deleted';
				}
		
				// redirect page
				Res.redirect('/dashboard');	
				Res.end();
			}
			
			
		});
	}

	// edit device
	this.editDevice = function(){

		var id = Req.query.d;
		var token = Req.query.d+'kioxApp';

		if( token == Req.query.token && Req.session.userId ){

			managedevice_model.getDeviceInfo(id, function(err, result){
				if(err){
					throw err;
					return;
				}

				if(result){
					var error = (Req.session.msg)? Req.session.msg : false;
					Res.render('edit-device'+fileExt, {data: {_id:Req.session.userId, name: Req.session.userName, image: Req.session.userImg }, device: result, url:url, error: error });
				}
				else{
					Req.session.msg = 'Sorry, device data not found';
					Res.redirect('/dashboard');	
				}
				
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


	this.updateDevice = function(){
		if (Req.method === 'POST' && Req.session.userId) {

			var currentDateTime = getDate()+' '+getTime();

			var fileName='', deviceName, validFlag, oldImg, id, fileFlag;
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
		      
		      if(fieldname == 'deviceName'){
		      	deviceName = val;
		      }
		      else if(fieldname == 'd'){
		      	id = val;
		      }
		      else if(fieldname == 'img'){
		      	oldImg = val;

		      	// update device information if image not uplaod
		      	if(validFlag && fileFlag == undefined){
		      		fileName = oldImg;

		    		managedevice_model.updateDevice({userId: Req.session.userId, name:deviceName, file:fileName, date:currentDateTime, id: id, image: oldImg, imgFlag: true}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update device successfully!';	
								Res.redirect('/dashboard');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Device could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/managedevice/editDevice/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});
		      	}
		      }
		      	
		    });

		    busboy.on('finish', function() {

		    	if(validFlag){ // check malacious file

		    		managedevice_model.updateDevice({userId: Req.session.userId, name:deviceName, file:fileName, date:currentDateTime, id: id, image: oldImg, imgFlag: false}, function(err, result){
						if(err){
							throw err;
						}
						else{
							if(result){ // redirect dashboard page if successfully add device
								Req.session.msg = 'Update device successfully!';	
								Res.redirect('/dashboard');
							}
							else{ // redirect manage device page if device not add successfully
								Req.session.msg = 'Device could not update successfully!';
								var token = id+'kioxApp';	
								Res.redirect('/managedevice/editDevice/?token='+token+'&d='+id);
							}
						}
						Res.end();
					});

		    	}
		    	else{
		    		Req.session.msg = 'Device icon could not upload!';
		    		var token = id+'kioxApp';	
					Res.redirect('/managedevice/editDevice/?token='+token+'&d='+id);
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

ManageDeviceController.__proto__ = new controller();

module.exports = ManageDeviceController;