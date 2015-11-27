/****************************
* Add device Schema
****************************/

module.exports = {

	DeviceSchema: function(mongoose){

		// create user table schema
		var deviceSchema = new mongoose.Schema({
			userid: 'string',
			name: 'string',
			image: 'string',
			status: { type: Boolean, default:true },
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.DeviceSchema) {
			return mongoose.model('DeviceSchema');
		}

		return mongoose.model('DeviceSchema', deviceSchema);
	}

	
}