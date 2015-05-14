me = this

exports.logError = function(err) {
	console.log(err)
}

exports.handleError = function(err) {
	if (err.name == 'MongoError') {
		if (err.code == 11000 || err.code == 11001) {
			return "Duplicate key error"
		} else {
			return "Uknown error code"
		}
	}
}

exports.test = function() {
	me.logError("Test")
}

exports.reportError = function (err) {
	
}