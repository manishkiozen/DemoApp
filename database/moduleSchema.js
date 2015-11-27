/****************************
* Add modules Schema
****************************/

module.exports = {

	ModuleSchema: function(mongoose){

		// create user table schema
		var moduleSchema = new mongoose.Schema({
			device_id: 'string',
			deviceName: 'string',
			name: 'string',
			image: 'string',
			status: { type: Boolean, default:true },
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.ModuleSchema) {
			return mongoose.model('ModuleSchema');
		}

		return mongoose.model('ModuleSchema', moduleSchema);
	}

	
}