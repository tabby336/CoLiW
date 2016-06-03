var simpleCommandExecuter = require('./twitter_simple_command_executer');
var twitterCommandHandlers = require('./twitter_command_handlers');
var utils = require('./utils.js');

const twitterFollow = "twitterfollow";
const twitterTweet = "twittertweet";
const twitterSearch = "twittersearch";
const twitterRetweet = "twitterretweet";

var appendToSecondCommand = function (secondCommand, hints) {
	console.log('secondCommand apend fct' + secondCommand + hints);
	if (secondCommand.indexOf('&&') === -1) {
		secondCommand = secondCommand + '&&';
	}

	console.log('secondCommand: ' + secondCommand);
	return secondCommand + hints;
}

var secondCommandHintsHelper = function (secondCommand, tweet) {
	var x = secondCommand;
	console.log(x + ' ' + lalal);
	if (x.replace(/[ ]/g, '') === twetterRetweet) {
		return ('i<<' + tweet.id_str);
	}
	if (x.replace(/[ ]/g, '') === twetterFollow) {
		return ('i<<' + tweet.user.id_str);
	}
	return '';
}

var twitterSearchHelper = function (req, res, secondCommand, response, result){
	console.log	("Sunt in functia de callback");
	var order = 0;
	if (result[1] !=undefined) {
		order = parseInt(result[1]);
	}
	if (response.statuses[order] != undefined){
		var tweet = response.statuses[order];
		console.log(secondCommand);
		//var hints = secondCommandHintsHelper(secondCommand, tweet);s
		console.log(tweet);
		if (secondCommand.replace(/[ ]/g, '') === twitterRetweet) {
			secondCommand = appendToSecondCommand(secondCommand, ('i<<' + tweet.id_str));
		}
		if (secondCommand.replace(/[ ]/g, '') === twitterFollow) {
			console.log(tweet);
			secondCommand = appendToSecondCommand(secondCommand,('n<<' + tweet.user.screen_name));
		}
		console.log('secondCommand: !!!' + secondCommand);
		simpleCommandExecuter.singleCommandExecute(req, res, secondCommand);
	}
	else {
		req.session.command_output = 'Not enough tweets :(';
		return res.redirect('/');
	}
}

function twitterSearchFirst(req, res, splitedFirstCommand, secondCommand) {
	console.log(twitterSearch);
	var result = utils.validHints(['m', 'p'], splitedFirstCommand[1]);
	if (result instanceof Error){
		//afiseaza eroarea la client
		console.log("EROAREA VIETIIII: " + result);
		req.session.command_output = 'Some problem :(';
		return res.redirect('/');
	}
	else {
		twitterCommandHandlers.searchTweet(req, result[0]).then(function(response){
			twitterSearchHelper(req, res, secondCommand, response, result);
		})
		.catch(function(err){
			//eroare la client
			console.log("EROAREA VIETIIII: " + err);
			req.session.command_output = 'Some problem :(';
			return res.redirect('/');
		});
	}
}

exports.doubleCommandExecute = function(req, res, commad) {
	console.log("doubleCommandExecute");
	var firstCommand = commad[0];
	var splitedFirstCommand = firstCommand.split('&&');
	var secondCommand = commad[1];
	var splitedSecondCommand = secondCommand.split('&&');

	if (splitedFirstCommand[0].replace(/[ ]/g, '') === twitterSearch) {
		twitterSearchFirst(req, res, splitedFirstCommand, secondCommand);
	}
}