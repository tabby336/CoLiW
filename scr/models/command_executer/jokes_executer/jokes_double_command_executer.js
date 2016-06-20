var twitterSimpleCommandExecuter = require('../twitter_executer/twitter_simple_command_executer');
var facebookSimpleCommandExecuter = require('../facebook_executer/facebook_simple_command_executer');
var gmailSimpleCommandExecuter = require('../gmail_executer/gmail_simple_command_executer');
var jokesCommandHandlers = require('./jokes_command_handler');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

var executeSecondCommand = function (req, res, joke, obj2) {
	if (obj2.provider == 'facebook' && obj2.action == 'post') {
		obj2.m = joke;
		facebookSimpleCommandExecuter.execute(req, res, obj2);
		return;
	}
	if (obj2.provider == 'twitter' && obj2.action == 'tweet') {
		obj2.m = joke;
		twitterSimpleCommandExecuter.execute(req, res, obj2);
		return;
	}
	if (obj2.provider == 'gmail' && obj2.action == 'send') {
		obj2.c = joke;
		obj2.s = 'Joke'
		gmailSimpleCommandExecuter.execute(req, res, obj2);
		return;
	}
}

function getFirst(req, res, obj1, obj2) {
	jokesCommandHandlers.getJoke(req, res, undefined, undefined).then(function(response){
		executeSecondCommand(req, res, response, obj2);
	})
	.catch(function(err){
		console.log(err);
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred.'));
	});
}

exports.execute = function(req, res, obj1, obj2) {
	switch (obj1.action) {
		case 'get': getFirst(req, res, obj1, obj2);
	}
}