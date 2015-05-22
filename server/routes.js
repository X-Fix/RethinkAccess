var UserCtrl = require('./user.controller'),
	DevCtrl = require('./dev.controller'),
	Watson = require('./watson.js')

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

	app.route('/devAuth')
		.post(DevCtrl.verify)
/*
	Dear Cameron
	This is drunk Cameron talking. There is a way to do this that the dev routes bypass the user routes.
	Look it up tomorrow, I think it's still open in one of your browser tabs (Just remember /birds, maybe in the e-book)
	Either do that or just continue the devAuth after the regular auth function
	Abstracting the dev routes from the user routes wll also avoid route leakage
	Go find Rebecca, she needs to take you home
*/

	// User/Admin level 
	app.use(Watson.auth)

	app.route('/user')
		.all(UserCtrl.getAllBaseUsers)
		.post(UserCtrl.addUser)
		.put(UserCtrl.updateUser)
		.delete(UserCtrl.deleteUser)
		.all(UserCtrl.updateBase)

	// Developer level
	app.use(Watson.devAuth)

	app.route('/base')
		.post(DevCtrl.createBase)
		.put(DevCtrl.updateDuration)

	app.route('/bases')
		.post(DevCtrl.getAllBases)


}