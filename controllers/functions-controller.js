/*************************************
* functions Controller
*************************************/

var FunctionController = function(){
	
	var functions_model;
	var model = require('../models/functions-model');
	functions_model = new model();

	// check action name 
	this.getFunctions = function(){

		functions_model.getFunctions( Req.body.sensorId, function(err, result){
			if(err){
				throw err;
			}
			else{
				//console.log('result=>'+JSON.stringify(result));
				Res.send(result);
				Res.end();
			}
		});
	}
}

FunctionController.__proto__ = new controller();

module.exports = FunctionController;