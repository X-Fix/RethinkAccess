process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	lib = require('./server/vars.js')

var db = mongoose();
var app = express();
var ServerCtrl = require('./config/server')

// Prepare on-server mirror of DB
ServerCtrl.initServer()

lib.server = app.listen(lib.port, function() {
	console.log('Server running, listening on port ' + lib.port)
})

lib.server.on('close', function() {
	console.log("Server closed...")
	setTimeout(function(){
		console.log("Server re-opened")
		lib.server.listen(lib.port)
	}, 10000)
})