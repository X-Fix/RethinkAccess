var fs = require('fs'),
	lib = require('./vars.js'),
	msgPrimed = ''

/*
	===== Middleware ====
*/


// Inspect every incoming httpRequest and run security protocols; Call next()
exports.reqInspection = function(req, res, next) {

	lib.curReqTally++

	if (lib.curReqTally > 20) {
		lib.server.close()
	}

	if (lib.alertTicker) {	// For every 2nd req, reduce alertLvl
		lib.alertTicker = 0
		lib.alertLvl--
	} else {
		lib.alertTicker++
	}
	
	if (lib.dbStatus) {	// Check that the db is connected to prevent request hanging

		if (lib.suspects[req.headers['x-forwarded-for']] < 3) {	// Check that this particular IP is within suspicion limits

			if (req.headers['X-GNU'] && 'Terry Pratchett' === req.headers['X-GNU']) {	// Check for GNU header validating request came from a legitimate source
				
				setTimeout(function() {

					console.log("Pause successful. Timeout=" + lib.alertLvl)
					return next()

				}, lib.alertLvl * 1000)
	
			} else {	// GNU header missing, 
				noteIp(req.headers['x-forwarded-for'])	// Note suspicious IP
				
				lib.alertLvl ++		// Increase alertLvl

				var msg = "GNU header missing; " + req.headers['x-forwarded-for'] + "; alertLvl " + lib.alertLvl	// log possible hacker attempt with IP address-
				writeLog(msg, "security")

				res.status(450).send('lol nope')	// and reject request
			}

		} else {	// Current request's IP has exceeded suspicion limits
			writeLog("IP " + req.headers['x-forwarded-for'] + " blocked")	// Log block command
			res.status(450).send("You fukkin wo' mate?!")	// and reject request
		}

	} else {
		writeLog(req.body.name + " failed operation while DB was down", 'errors')
		res.status(500).send("Fatal database error. Contact the app developer and report the following message: " + lib.db.err + ". \n" +
					"No further operations will be possible until this issue is resolved")
	}
}

// Check that token is valid and for Terry Pratchett header
exports.auth = function(req, res, next) {
	var now = new Date(), 
		token = req.headers['x-token']

	if (token && lib.loggedTokens[token] > now.getTime()) {	// Token matches and hasn't expired
		
		return next()

	} else if (!token) { // No token header

		noteIp(req.headers['x-forwarded-for']) 	// Note suspicious IP
		res.status(401).send("Sir, I'm gonna hav to ask you to leave")	// Reject req

	} else if (!lib.loggedTokens[token]) { // Token header has no match

		res.status(401).send("No shirt, no shoes, no service")

	} else {	// Token has expired

		res.status(401).send("I don't remember you, remind me?")

	}
}

exports.devAuth = function(req, res, next) {

}

exports.handleError = function(err) {

	/* ==Translate mongo query errors== */

	if (err.name == 'MongoError') {
		if (err.code == 11000 || err.code == 11001) {
			return "Duplicate key error. Resubmit the " + err.cause + " and ensure the name/ID is unique"
		} else if (err.message == 'connect ECONNREFUSED') {
			lib.db.err = err.message
			return  "Fatal database error. Contact the app developer and report the following message: " + err.message + ". \n" +
					"No further operations will be possible until this issue is resolved"
		} else {
			return "Error code unnaccounted for. Contact the app developer and report the following message: " + err.message
		}
	}


	/* ==Report Database Status Changes== */

	if (lib.db.status) {
		if (msgPrimed) {	// If DB has just come back online, log and flush primed message
			writeLog(msgPrimed, 'errors')				// Log message

			msgPrimed = ''
		}
	} else if (lib.db.status === false) { // If db is disconnected, log failure to connect and prime reconnection message
		var logMsg = "Database disconnected: " + err.message
		writeLog(logMsg, 'errors')		//Log error

		msgPrimed = "Db reconnected"
	}
	
}

/*
	==== Extras ====
*/

exports.checkout = function() {
	lib.curReqTally--
}

exports.issueToken = function(baseDuration) {
	var token = {},
		hashDigits = [],
		hashKey,
		date = new Date() // Date today

	date.setTime( date.getTime() + baseDuration * 3600000) // Add token duration (hours)
	token.expires = date 

	// i < hashKey.length
	for (i = 0; i < 32; i++) {
		do {
			hashDigits[i] = Math.round(Math.random() * 16); // Generate hexadecimal value
			if (hashDigits[i] > 9) {
				// Convert to hex digit string
				hashDigits[i] = lib.hexDigits[hashDigits[i]-10];
			}
			else {
				// Convert to number string
				hashDigits[i] = hashDigits[i].toString();
			}
		} while (hashDigits[i] == hashDigits[i-1]) // Don't allow doubles in the sequence
	}

	hashKey = hashDigits.join("");
	token.hashKey = hashKey

	return token
}

/*
	=================== Custom functions ===================
*/

function noteIP(suspectIp) {
				
	if (lib.suspects[suspectIp]) {	// Check if IP has been previously reported
		lib.suspects[suspectIp] ++		// Add strike
	} else {						// If not
		lib.suspects[suspectIp] = 1 	// Start strike count
	}
}

function writeLog(string, file) {
	var stamp = newTimeStamp(),
		logString = "- " + stamp.date + " (" + stamp.day + ") " + string + " at " + stamp.time + "\r",
		filename = file + '.txt'
	
	fs.appendFile(filename, logString, function (err) {
		if (err) {
			console.log("Error writing to " + filename + ": " + err);
		}
	})
}

function newTimeStamp() {
	
	var now = new Date();
	// Get pieces
	var dd = now.getDate(),
		mm = now.getMonth()+1,
		yyyy = now.getFullYear(),
		day = lib.weekdays[now.getDay()],
		hour = now.getHours()+2, // +2 for time zone difference to server location
		min = now.getMinutes()

	// Format pieces
	if(dd<10){
		dd='0'+dd;
	}
	if(mm<10){
		mm='0'+mm;
	}
	if(hour<10){
		hour='0'+hour;
	}
	if(min<10){
		min='0'+min;
	}

	// Prepare stamp object
	var stamp = {
		time: hour + ":" + min,
		date: dd + "/" + mm + "/" + yyyy,
		day: day
	}

	return stamp
}













