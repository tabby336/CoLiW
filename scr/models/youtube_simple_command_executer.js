var youtubeCommandHandlers = require('./youtube_command_handlers');
var utils = require('./utils.js');


const youtubeSearch = "youtubesearch";

exports.singleCommandExecute = function(req, res, cmd) {
	console.log('singleCommandExecute:' + cmd);
	var splitCmd = cmd.split('&&');

	if (splitCmd[0].replace(/[ ]/g, '') === youtubeSearch) {
		var result = utils.validHints(['m', 'p'], splitCmd[1]);
		if (result instanceof Error) {
			//afiseaza eroarea la client
			req.session.command_output = 'Youtube command not executed';
			return res.redirect('/');
		}
		else {
			console.log('result: ' + result);
			youtubeCommandHandlers.search(req, result[0]).then(function(response){
				console.log('Minunat, ai gasit o melodie wow!');
				if (result[1] === undefined) {
					console.log('https://www.youtube.com/watch?v=' + response.items[0].id.videoId);
					req.session.command_output = 'https://www.youtube.com/watch?v=' + response.items[0].id.videoId;
				} else {
					req.session.command_output = 'https://www.youtube.com/watch?v=' + response.items[parseInt(result[1])].id.videoId;
					console.log('https://www.youtube.com/watch?v=' + response.items[parseInt(result[1])].id.videoId);	
				}
				return res.redirect('/');
			})
			.catch(function(){
				req.session.command_output = 'Youtube command not executed';
				return res.redirect('/');
			});
		}
	}
	else {
		//comanda inexistenta
		req.session.command_output = 'Bad youtube command format :(';
		return res.redirect('/');
	}
}
