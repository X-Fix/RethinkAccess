var Base = require('mongoose').model('Base'),
	lib = require('./vars.js')

/*
======================= Initial GET =======================
*/

exports.renderLogin = function (req, res) {
	
}

/*
======================= Creating =======================
*/

exports.addUser = function(req, res, next) {
	var newUser = {
		name: req.body.name,
		password: req.body.password,
		adminLvl: req.body.adminLvl,
		cardNo: req.body.cardNo
		}

	req.users.push(newUser)

	return next()
}
	

/*
======================= Reading =======================
*/

exports.verifyPassword = function(req, res, next) {

	if (req.userIndex >= 0 && req.users[req.userIndex].password == req.body.password) {
		// Prepare token details
		var token = {
			hash: newHash(),
			expires: newExpires(lib.baseDurations[10])
		}

		// Set headers
		res.set('Access-Control-Expose-Headers', 'X-Base, X-Token')
			.set('X-Token', token.hash)
			.set('X-Base', req.basecode)

		// Save token details
		// In vars.js
		lib.loggedTokens[token.hash] = token.expires

		// In Database
		req.users[req.userIndex].token = token.hash
		req.users[req.userIndex].expires = token.expires

		return next()

	} else {
		res.status(401).send("Invalid details")
	}
}

exports.getAllBaseUsers = function(req, res, next) {
	
	var condition;
	if (req.body.basecode) {
		condition = {basecode:req.body.basecode}
	} else {
		condition = {'users.name':req.body.name}
	}

	Base.findOne(
			condition, 
			function (err, base) {
		if (err) {
			res.status(500).send(err.message)
		} else if (!base) {
			res.status(404).send("No base found")
		} else {
			req.users = base.users
			req.basecode = base.basecode
			req.userIndex = indexOfProperty(req.users, "name", req.body.name, req.users.length)
			return next()
		}
	})
}

exports.showBaseUsers = function(req, res) {
	res.send(req.users)
}

/*
======================= Updating =======================
*/

exports.updateUser = function(req, res, next) {
	req.users[req.userIndex][req.body.property] = req.body.value
	return next()
}

exports.deleteUser = function(req, res, next) {
	req.users.splice(req.userIndex, 1)
	return next()
}

exports.updateBase = function(req, res) {
	Base.findOneAndUpdate(
			{ basecode: req.basecode }, 
			{ users : req.users}, 
			function (err, base) {
		if (err) {
			res.status(500).send("Base update error")
		} else {
			console.log(base)
			res.status(204).end()
		}
	})
}

/*
======================= Custom Methods =======================
*/

function newExpires(duration) {
	var date = new Date() // Date today
	date.setTime( date.getTime() + duration * 3600000) // Add tokenDuration (hours)
	return date //return result
}

function newHash() {
	var hash = [];
	for (i = 0; i < 32; i++) {
		do {
			hash[i] = Math.round(Math.random() * 16); // Generate hexadecimal amount
			if (hash[i] > 9) {
				// Convert to hex digit string
				hash[i] = lib.hexDigits[hash[i]-10];
			}
			else {
				// Convert to number string
				hash[i] = hash[i].toString();
			}
		} while (hash[i] == hash[i-1]) // Don't allow doubles in the sequence
	}
	var token = hash.join("");
	return token;
}

function indexOfProperty(collection, property, value, length) {
	for (var i=0; i<length; i++) {
		if (collection[i][property] == value) {
			return i
		}
	}
	return -1
}