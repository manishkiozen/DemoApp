/****************************
* Add local system monitoring Schema
****************************/

module.exports = {

	LocalSysSchema: function(mongoose){

		// create user table schema
		var localSysSchema = new mongoose.Schema({
			userid: 'string',
			data: 'string',
			status: { type: Boolean, default:true },
			dateTime: { type: 'string', default:''}
		});

		// check models exists or not
		if (mongoose.models.LocalSysSchema) {
			return mongoose.model('LocalSysSchema');
		}

		return mongoose.model('LocalSysSchema', localSysSchema);
	}

	
}