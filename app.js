process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	express = require('./config/express');

var db = mongoose();
var app = express();
var ServerCtrl = require('./config/server')

// Prepare on-server mirror of DB
ServerCtrl.initServer()

app.listen(process.env.PORT || 3000);

console.log('Server running, listening on port ' + process.env.PORT);