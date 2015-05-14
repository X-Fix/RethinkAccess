var mongoose = require('mongoose'),
	watson = require('../server/watson.js'),
	lib = require('../server/vars.js')

module.exports = function() {
	mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/mean-book')
	
	require('../server/models.js')

	var db = mongoose.connection;

	db.on('error', function(err) { // Error response
		watson.reportError(err)
		console.log(">Error")
	}); 

	db.on('disconnected', function (err) {
		lib.dbStatus = false
		console.log(">Disconnected")
	})

	db.on('connected', function () {
		lib.dbStatus = true
		console.log(">Connected")
	})

	return db
}