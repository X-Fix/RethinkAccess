var mongoose = require('mongoose')

module.exports = function() {
	var db = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/mean-book')

	return db
}