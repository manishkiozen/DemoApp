/****************************
* Create user account Schema
****************************/

module.exports = {

	UserSchema: function(mongoose){

		// create user table schema
		var userSchema = new mongoose.Schema({
			name: 'string',
			username: 'string',
			email: 'string',
			password: 'string',
			image: { type: 'string', default:'' },
			status: { type: Boolean, default:false },
			dateTime: { type: 'string', default:'' }
		});

		// check models exists or not
		if (mongoose.models.UserAccount) {
			return mongoose.model('UserAccount');
		}

		return mongoose.model('UserAccount', userSchema);
	}

	
}