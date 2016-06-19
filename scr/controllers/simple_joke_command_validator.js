var toClient = require('./send_to_client');
var outputFormat = require('./format_output');
var util = require('./utils_validation');

exports.validateJokeAction = function(obj) {
	switch (obj.action) {
		case 'get': return util.validateNoHints(obj); break;
	}
}

