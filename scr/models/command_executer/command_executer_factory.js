var utils = require('../../controllers/utils_validation');

// facebook
var facebookSimpleCommandExecuter = require('./facebook_executer/facebook_simple_command_executer');

// twitter
var twitterSimpleCommandExecuter = require('./twitter_executer/twitter_simple_command_executer');
var twitterDoubleCommandExecuter = require('./twitter_executer/twitter_double_command_executer');

// youtube
var youtubeSimpleCommandExecuter = require('./youtube_executer/youtube_simple_command_executer');
var youtubeDoubleCommandExecuter = require('./youtube_executer/youtube_double_command_executer');

//calendar
var calendarSimpleCommandExecuter = require('./google_executer/calendar_simple_command_executer'); 

//joke
var jokeSimpleCommandExecuter = require('./jokes_executer/jokes_simple_command_executer'); 

function executeSimpleCommand(req, res, splitedCommand) {
	var obj = utils.getCommadObject(splitedCommand[0]);
	switch (obj.provider) {
		case "facebook": facebookSimpleCommandExecuter.execute(req, res, obj);
			break;
		case "twitter": twitterSimpleCommandExecuter.execute(req, res, obj);
			break;
		case "youtube": youtubeSimpleCommandExecuter.execute(req, res, obj);
			break;
		case "calendar": calendarSimpleCommandExecuter.execute(req, res, obj);
			break;
		case "joke": jokeSimpleCommandExecuter.execute(req, res, obj);
			break;
	}
} 

function executeDoubleCommand(req, res, splitedCommand) {
	var obj1 = utils.getCommadObject(splitedCommand[0]);
	var obj2 = utils.getCommadObject(splitedCommand[1]);
	switch (obj1.provider) {
		case "twitter": twitterDoubleCommandExecuter.execute(req, res, obj1, obj2);
			break;
		case "youtube": youtubeDoubleCommandExecuter.execute(req, res, obj1, obj2);
			break;
	}
}

exports.execute = function(req, res) {
	var cmd = req.session.cmd;
	var splitedCommand = cmd.split('|');
	console.log('*** in executer command ***');
	switch (splitedCommand.length) {
		case 1: executeSimpleCommand(req, res, splitedCommand);
			break;
		case 2: executeDoubleCommand(req, res, splitedCommand);
			break;
		default:
			// prea multe comenzi trebuie trimis mesaj la client!!!
	}
}