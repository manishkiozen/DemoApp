/****************************
* Thing Schema
****************************/

module.exports = {

	ThingSchema: function(mongoose){

		// create user table schema
		var thingSchema = new mongoose.Schema({
			user_id: 'string',
			thingName: 'string',
			device: 'object',
			modules: { type: 'array', default:[] },
			sensors: { type: 'array', default:[] },
			actions: { type: 'object', default:{} },
			alarms: { type: 'object', default:{} },
			analytics: { type: 'object', default:{} },
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.ThingSchema) {
			return mongoose.model('ThingSchema');
		}

		return mongoose.model('ThingSchema', thingSchema);
	}
	
}