var simpleCommandExecuter = require('./twitter_simple_command_executer');
var twitterCommandHandlers = require('./twitter_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

function executeSecondCommand(req, res, param, obj2) {	
	switch(obj2.action) {
		case 'retweet': obj2.i = param.id_str; break;
		case 'follow': obj2.n = param.user.screen_name; break;
	}
	simpleCommandExecuter.execute(req, res, obj2);
}

function searchFirst(req, res, obj1, obj2) {
	twitterCommandHandlers.searchTweet(req, obj1.m).then(function(response){
		var param = response.statuses[0];
		if (obj1.p != undefined) {
			if (response.statuses[parseInt(obj1.p)] != undefined) {
				param = response.statuses[parseInt(obj1.p)];
			}
			else {
				toClient.send(req, res, outputFormat.errorMessage('This tweet number is on another page. Pease enter a numeber less than 15.'));
			}
		}
		executeSecondCommand(req, res, param, obj2);
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

exports.execute = function(req, res, obj1, obj2) {
	switch (obj1.action) {
		case 'search': searchFirst(req, res, obj1, obj2); break;
	}
}