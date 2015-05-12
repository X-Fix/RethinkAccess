//var Base = require('mongoose').model('Base')

/*
======================= Initial GET =======================
*/

exports.renderLogin = function (req, res) {
	res.render('index')
}

/*
======================= Reading =======================
*/

exports.verifyPassword = function(req, res) {
	if (req.user.password == req.body.password) {
		res.send("Log in successfull")
	} else {
		res.status(401).send("Invalid password")
	}
}

exports.getSingleUser = function(req, res, next) {
	Base.find({"user.name" : req.body.name}, function (err, base) {
		if (err) {
			res.status(500).send(err.message)
		} else if (!base.length) {
			res.status(404).send("No user found")
		} else {
			req.user = base.user[indexOfProperty(base, "name", req.body.name, base.length)]
			return next()
		}
	})
}

/*
======================= Custom Methods =======================
*/

function indexOfProperty(collection, property, value, length) {
	for (var i=0; i<length; i++) {
		if (collection[i][property] == value) {
			return collection[i]
		}
	}
	throw new err("Property value does not exist in collection")
}