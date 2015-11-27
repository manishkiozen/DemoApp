/****************************
* Add Action Schema
****************************/

module.exports = {

	AlarmSchema: function(mongoose){

		// create user table schema
		var alarmSchema = new mongoose.Schema({
			name: 'string',
			sensors: 'array',
			sensorsName: 'array',
			action: 'array',
			actionsName: 'array',
			condition: 'array',
			time_value: 'string', 
			time: 'string',
			calltoaction: 'string',
			aletby: 'array',
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.AlarmSchema) {
			return mongoose.model('AlarmSchema');
		}

		return mongoose.model('AlarmSchema', alarmSchema);
	}

	
}
