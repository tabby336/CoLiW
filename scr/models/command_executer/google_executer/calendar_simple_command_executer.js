var calendarCommandExecuter = require('./calendar_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');
var utils = require('../../../controllers/utils_validation');

function events(req, res, obj) {
	if (obj.c == undefined) {
		obj.c = 10;
	} else {
		obj.c = parseInt(obj.c);
	}
	console.log('????? ' + obj.d);
	calendarCommandExecuter.listEvents(req, res, obj.d, obj.c).then(function(response) {
		if (response.items != undefined) {
			var forClientResponse = '';
			var i = 0;
			//console.log(response.items[0]);
			while (response.items[i] != undefined) {
				forClientResponse = forClientResponse + outputFormat.calendarEventFormat(response.items[i]);
				++i;
			}
			//console.log(forClientResponse);
			toClient.send(req, res, forClientResponse);
		}
		else {
			toClient.send(req, res, outputFormat.okMessage('There are no events for your request'));
		}

	}).catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error occurred. '  + error));
	});
}

function insert(req, res, obj) {
	calendarCommandExecuter.insert(req, res, {}).then(function(response) {
		console.log('OK!!!! '  + response);
	}).catch(function(error){
		console.log('ERROR!!! ' + error);
	});
}

exports.execute = function(req, res, obj) {
	//console.log(JSON.stringify(obj));
	switch (obj.action) {
		case "events": events(req, res, obj); break;
		case "insert": insert(req, res, obj); break;
	}
}
