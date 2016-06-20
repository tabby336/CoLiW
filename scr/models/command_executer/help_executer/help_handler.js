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

exports.help = function(req, res, cmd) {
	splitted_help = cmd.replace(/\s+/g,' ').split(' ');
	
	console.log("THE LENGTH: " + splitted_help.length);
	console.log(splitted_help[0]);

	if(splitted_help.length > 2) {
		toClient.send(req, res, "NOT OK");
		return;
	}

	var help = '';

	if(splitted_help.lenth == 1) {
		help = help + facebook.help();
		help = help + twitter.help();
		help = help + youtube.help();
		help = help + jokes.help();
		help = help + google_mail.help();
		help = help + google_calendar.help();
		toClient.send(req, res, help);
		return;
	}	

	switch(splitted_help[1]) {
		case "facebook":
			help = help + facebook.help();
		case "twitter":
			help = help + twitter.help();
		case "youtube":
			help = help + youtube.help();
		case "jokes":
			help = help + jokes.help();
		case "gmail":
			help = help + google_mail.help();
		case "calendar":
			help = help + google_calendar.help();
		default: 
			toClient.send(req, res, "Not a provider");
	}

	toClient.send(req, res, help);
	
}