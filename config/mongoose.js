var mongoose = require('mongoose'),
	Watson = require('../server/watson.js'),
	lib = require('../server/vars.js')

module.exports = function() {
	mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/mean-book')
	
	require('../server/models.js')

	var db = mongoose.connection;

	db.on('error', function(err) { // Error response
		Watson.handleError(err)
		lib
		console.log(">Error")
	}); 

	db.on('disconnected', function (err) {
		lib.db.status = false
		console.log(">Disconnected")
	})

	db.on('connected', function () {
		lib.db.status = true
		console.log(">Connected")
	})

	return db
}