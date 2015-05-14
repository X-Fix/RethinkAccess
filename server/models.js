var mongoose = require('mongoose'),
	Schema = mongoose.Schema

var BaseSchema = new Schema({
	basecode: String,
	tokenDuration: Number,
	users : [{
		name: {
			type: String,
			trim: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		adminLvl: {
			type: String,
			required: true
		},
		cardNo: {
			type: String,
			default: ""
		},
		token: {
			type: String,
			default: ""
		},
		expires: {
			type: Date,
			default: null
		}
	}]
})

mongoose.model('Base', BaseSchema)