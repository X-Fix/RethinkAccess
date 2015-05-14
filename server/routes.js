var UserCtrl = require('./user.controller'),
	DevCtrl = require('./dev.controller');

module.exports = function(app) {
	app.get('/', UserCtrl.renderLogin)

	app.get('/devTest', DevCtrl.testA)

	app.route('/test')
		.post(UserCtrl.getAllBaseUsers)
		.post(UserCtrl.showBaseUsers)

	app.route('/auth')
		.post(UserCtrl.getAllBaseUsers)
		.post(UserCtrl.verifyPassword)
		.post(UserCtrl.updateBase)

	app.route('/user')
		.all(UserCtrl.getAllBaseUsers)
		.post(UserCtrl.addUser)
		.put(UserCtrl.updateUser)
		.delete(UserCtrl.deleteUser)
		.all(UserCtrl.updateBase)

	app.route('/base')
		.post(DevCtrl.createBase)
		.put(DevCtrl.updateDuration)

	app.route('/bases')
		.post(DevCtrl.getAllBases)
}