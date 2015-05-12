process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	express = require('./config/express');

var db = mongoose();
var app = express();
var port = process.env.PORT || 3000;
app.listen(port);

module.exports = app

console.log('Server running, listening on port ' + process.env.PORT);