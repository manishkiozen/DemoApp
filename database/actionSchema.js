/****************************
* Add Action Schema
****************************/

module.exports = {

	ActionSchema: function(mongoose){

		// create user table schema
		var actionSchema = new mongoose.Schema({
			name: 'string',
			sensorId: 'string',
			sensorName: 'string',
			functions: 'string',
			functionId: 'string',
			operators: 'string',
			value: 'string',
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.ActionSchema) {
			return mongoose.model('ActionSchema');
		}

		return mongoose.model('ActionSchema', actionSchema);
	}

	
}