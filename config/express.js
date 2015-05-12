var cors = require('cors'),
	express = require('express'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	chipRequest = require('superagent'),
	fs = require('fs'),
	session = require('express-session');

module.exports = function() {
	var app = express();

	if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(cors());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.set('views', './app/views')
	app.set('view engine', 'ejs')

	require('../server/routes.js')(app);

	return app;
}