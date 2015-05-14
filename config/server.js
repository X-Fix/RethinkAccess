var Base = require('mongoose').model('Base'),
	lib = require('../server/vars.js')

exports.initServer = function() {
	Base.find({}, function (err, bases) {
		if (err) {

		} else {
			for (var i=0, len = bases.length; i<len; i++) {
				curBase = bases[i]
				lib.baseDurations[curBase.basecode] = curBase.tokenDuration
				for (var x=0, length = curBase.users.length;x<length;x++) {
					curUser = curBase.users[x]
					lib.loggedTokens[curUser.token] = curUser.expires
				}
			}
			console.log("Server Initialised")
		}
	})
}