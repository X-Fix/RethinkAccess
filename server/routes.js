var UserCtrl = require('./user.controller');

module.exports = function(app) {
	app.get('/', function (req, res) {
		res.send("Server running successfully");
	})
}