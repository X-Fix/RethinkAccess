var Base = require('mongoose').model('Base'),
	lib = require('./vars.js'),
	Watson = require('./watson.js')

/*
======================= Creating =======================
*/
exports.testA = function(req, res, next) {
	res.send()
}

exports.testB = function(req, res) {
	res.send()
}

exports.createBase = function(req, res) {
	var base = new Base({
		basecode: req.body.basecode,
		users : [{
			name: req.body.name,
			password: req.body.password,
			adminLvl: "1"
		}]
	})

	base.save(function (err, base) {
		if (err) {
			err.cause = "Base"
			// Send error response
			Watson.checkout()
			res.status(500).send(Watson.handleError(err))
		}
		else {
			lib.bases[req.body.basecode] = [];
			// Update vars.js
			lib.bases[req.body.basecode][req.body.name] = {adminLvl: "1"}
			// Send success
			Watson.checkout()
			res.status(201).end()
		}
	})
}

/*
======================= Reading =======================
*/

exports.getAllBases = function(req, res, next) {
	Base.find({}, function (err, bases) {
		if (err) {
			Watson.checkout()
			res.status(500).send(Watson.handleError(err))
		} else {
			Watson.checkout()
			res.send(bases)
		}
	})
}

/*
======================= Updating =======================
*/

exports.updateDuration = function(req, res, next) {
	Base.findOneAndUpdate(
		{basecode: req.body.basecode}, 
		{tokenDuration: req.body.tokenDuration}, 
		function (err, base) {
			if (err) {
				Watson.checkout()
				res.status(500).end()
			} else {
				Watson.checkout()
				res.status(204).end()
			}
		}
	)
}

/*
======================= Custom Functions =======================
*/






