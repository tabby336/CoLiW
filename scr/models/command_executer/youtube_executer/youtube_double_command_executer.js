var twitterSimpleCommandExecuter = require('../twitter_executer/twitter_simple_command_executer');
var facebookSimpleCommandExecuter = require('../facebook_executer/facebook_simple_command_executer');
var youtubeCommandHandlers = require('./youtube_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

var executeSecondCommand = function (req, res, url, obj2) {
	if (obj2.provider == 'facebook' && obj2.action == 'post') {
		obj2.u = url;
		facebookSimpleCommandExecuter.execute(req, res, obj2);
		return;
	}
	if (obj2.provider == 'twitter' && obj2.action == 'tweet') {
		if (obj2.m != undefined) { obj2.m = obj2.m + " " +url; }
		else { obj2.m = url;}
		twitterSimpleCommandExecuter.execute(req, res, obj2);
		return;
	}
}

function searchFirst(req, res, obj1, obj2) {
	youtubeCommandHandlers.search(req, obj1.m).then(function(response){
		var param = response.items[1];
		if (obj1.p != undefined) {
			if (response.items[parseInt(obj1.p)] != undefined) {
				param = response.items[parseInt(obj1.p)];
			}
			else {
				toClient.send(req, res, outputFormat.errorMessage('This youtube video number is on another page. Pease enter a numeber less than 15.'));
			}
		}
		executeSecondCommand(req, res, 'https://www.youtube.com/watch?v=' + param.id.videoId, obj2);
	})
	.catch(function(err){
		console.log(err);
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred.'));
	});
}

exports.execute = function(req, res, obj1, obj2) {
	switch (obj1.action) {
		case 'search': searchFirst(req, res, obj1, obj2);
	}
}