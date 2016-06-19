var toClient = require('./send_to_client');
var outputFormat = require('./format_output');

function get(obj) {
	return Object.keys(commandObj).length == 2;
}

exports.validateJokeAction = function(obj) {
	switch (obj.action) {
		case 'get': return get(obj); break;
	}
}

