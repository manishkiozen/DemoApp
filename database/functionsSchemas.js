/****************************
* functions Schema
****************************/

module.exports = {

	FunctionSchemas: function(mongoose){

		// create user table schema
		var functionSchemas = new mongoose.Schema({
			name: 'string',
			sensorId: 'string',
			sensorName: 'string',
			status: { type:Boolean, default:true }
		});

		// check models exists or not
		if (mongoose.models.FunctionSchemas) {
			return mongoose.model('FunctionSchemas');
		}

		return mongoose.model('FunctionSchemas', functionSchemas);
	}

	
}
