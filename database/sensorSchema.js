/****************************
* Add sensor Schema
****************************/

module.exports = {

	SensorSchema: function(mongoose){

		// create user table schema
		var sensorSchema = new mongoose.Schema({
			device_id: 'string',
			deviceName: 'string',
			name: 'string',
			image: 'string',
			status: { type: Boolean, default:true },
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.SensorSchema) {
			return mongoose.model('SensorSchema');
		}

		return mongoose.model('SensorSchema', sensorSchema);
	}

	
}