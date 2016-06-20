var facebook = require('../facebook_executer/facebook_command_handlers'); 
var twitter = require('../twitter_executer/twitter_command_handlers');
var youtube = require('../youtube_executer/youtube_command_handlers');
var jokes = require('../jokes_executer/jokes_command_handler');
var google_mail = require('../gmail_executer/gmail_command_handlers');
var google_calendar = require('../google_executer/calendar_command_handlers');
/*
var google_calendar = 
*/

var toClient = require('../../../controllers/send_to_client');

exports.help = function(req, res) {
	var help = facebook.help();
	help = help + twitter.help();
	help = help + youtube.help();
	help = help + jokes.help();
	help = help + google_mail.help();
	help = help + google_calendar.help();

	toClient.send(req, res, help);
}