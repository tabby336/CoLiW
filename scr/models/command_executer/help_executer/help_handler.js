var facebook = require('../facebook_executer/facebook_command_handlers'); 
var twitter = require('../twitter_executer/twitter_command_handlers');
var youtube = require('../youtube_executer/youtube_command_handlers');
/*

var google_calendar = 
var google_mail = 
var joke =
*/

var toClient = require('../../../controllers/send_to_client');

exports.help = function(req, res) {
	var help = facebook.help();
	help = help + twitter.help();
	help = help + youtube.help();

	toClient.send(req, res, help);
}