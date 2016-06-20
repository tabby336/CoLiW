var calendarCommandExecuter = require('./calendar_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');
var util = require('../../../controllers/utils_validation');
var credentialsUtils = require('../oauth_refresh_token');

var oauthModule = require('../../../controllers/oauth');
var oauth = oauthModule.oauth;

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

function transformToISO(obj) {
	var date = new Date(obj.day);
	date.setHours( obj.hour); 
	date.setMinutes(obj.minutes);
	console.log("23456789876543212345678   " + date);
	return date;
}

function createEventObj(obj) {
	var event = {start: {}, end: {}};

	if (obj.d != undefined) {
		event.start.date = util.getDateValid(obj.d).toISOString().slice(0, 10);
		event.end.date = util.getDateValid(obj.d).toISOString().slice(0, 10);
	}
	if (obj.p != undefined) {
		var interval = commandObj.p.split('-');
		event.start.dateTime = transformToISO(util.getValidDateJSON(interval[0]));
		event.end.dateTime = transformToISO(util.getValidDateJSON(interval[1]));
	}
	if (obj.s != undefined) {
		event.summary = obj.s;
	}
	if (obj.l != undefined) {
		event.location = obj.l;
	}

	return event;
}

function insert(req, res, obj) {
	var event = createEventObj(obj);
	calendarCommandExecuter.insert(req, res, event).then(function(response) {
		toClient.send(req, res, outputFormat.calendarInsertFormat(response));
	}).catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred.'));
	});
}

exports.execute = function(req, res, obj) {
	//console.log(JSON.stringify(obj));
	//credentialsUtils.refreshTokens(req, 'google_calendar', function(_) {
	oauth.refreshCredentials('google_calendar', req.session)
	.then(function(request_object) {
		console.log(request_object);
		//console.log(req.session.oauth.google_calendar);
		switch (obj.action) {
			case "events": events(req, res, obj); break;
			case "insert": insert(req, res, obj); break;
		}
	})
	.fail(function(e) {
		console.log(e);
	});
	//});
}
