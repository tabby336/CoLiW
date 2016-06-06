var twitterSimpleCommandExecuter = require('./twitter_simple_command_executer');
var facebookSimpleCommandExecuter = require('./facebook_simple_command_executer');
var youtubeCommandHandlers = require('./youtube_command_handlers');
var utils = require('./utils.js');

const twitterTweet = "twittertweet";
const youtubeSearch = "youtubesearch";
const facebookPost = "facebookpost";

var youtubeSearchHelper = function (req, res, secondCommand, response, result){
	console.log	("Sunt in functia de callback");
	var order = 0;
	if (result[1] !=undefined) {
		order = parseInt(result[1]);
	}
	console.log('order: ' + order);
	if (response.items[order] != undefined){
		var id = response.items[order].id.videoId;
		console.log(secondCommand);
		if (secondCommand.replace(/[ ]/g, '') === twitterTweet) {
			secondCommand = utils.appendToSecondCommand(secondCommand, 
				('m<<' + 'https://www.youtube.com/watch?v=' + id));
			twitterSimpleCommandExecuter.singleCommandExecute(req, res, secondCommand);
		}
		else
		if (secondCommand.split('&&')[0].replace(/[ ]/g, '')=== facebookPost) {
			console.log(facebookPost + ' se va incerca');
			secondCommand = utils.appendToSecondCommand(secondCommand, ('u<<' + 'https://www.youtube.com/watch?v=' + id));
			facebookSimpleCommandExecuter.singleCommandExecute(req, res, secondCommand);
		} 
		else {
			//comanda necunoscuta
			console.log('err');
			//return;
			req.session.command_output = 'Unknown error :(';
			return res.redirect('/');
		}
		console.log('secondCommand: !!!' + secondCommand);
		

	}
	else {
		//se afiseaza eroare la client (nu avem la dispoztie atatea tweet-uri)
		req.session.command_output = 'Not enough tweets :(';
		return res.redirect('/');
	}
}

function youtubeSearchFirst(req, res, splitedFirstCommand, secondCommand) {
	var result = utils.validHints(['m', 'p'], splitedFirstCommand[1]);
	console.log("THE RESUUULT: " + result);
	if (result instanceof Error){
		req.session.command_output = 'Some youtube problem :(';
		return res.redirect('/');
	}
	else {
		youtubeCommandHandlers.search(req, result[0]).then(function(response){
			youtubeSearchHelper(req, res, secondCommand, response, result);
		})
		.catch(function(err){
			console.log(err);
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

	if (splitedFirstCommand[0].replace(/[ ]/g, '') === youtubeSearch) {
		youtubeSearchFirst(req, res, splitedFirstCommand, secondCommand);
	}
}