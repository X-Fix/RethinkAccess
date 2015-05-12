var UserCtrl = require('./user.controller');

module.exports = function(app) {
	app.get('/', UserCtrl.renderLogin)

	//app.post('/auth', UserCtrl.getSingleUser)
}