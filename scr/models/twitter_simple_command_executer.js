var twitterCommandHandlers = require('./twitter_command_handlers');
var utils = require('./utils.js');

const twitterFollow = "twitterfollow";
const twitterTweet = "twittertweet"
const twitterSearch = "twittersearch";
const twetterRetweet = "twitterretweet";
const twitterGetTweets = "twittergettweets";
const twitterGetFriendsTweets = "twittergetfriendstweets";

function getUserTweets(req, id) {
	return new Promise(function(resolve, reject) {
		//console.log("Promise");
		twitterCommandHandlers.getTweets(req, undefined, id, 1).then(function(response){
		//console.log('get user tweets: ' + response[0].text);
		var responseForClientFriendTweets = '';
		//console.log(responseForClientFriendTweets);
		resolve(response[0].text);
		});
	});
}

exports.singleCommandExecute = function(req, res, cmd) {
	console.log(cmd);
	var splitCmd = cmd.split('&&');

	if (splitCmd[0].replace(/[ ]/g, '') === twitterTweet) {
		var result = utils.validHints(['m'], splitCmd[1]);
		if (result instanceof Error) {
			req.session.command_output = 'Can not post on twitter :(';
		}
		else {
			console.log('result: ' + result);
			twitterCommandHandlers.postTweet(req, result[0]).then(function(){
				console.log('Minunat, ai postat pe twitter!');
				//se transmite un mesaj la client
				req.session.command_output = 'Posted on twitter!! :D';
			})
			.catch(function(){
				//se transmite mesajj de eroare la client;
				req.session.command_output = 'Can not post on twitter :(';
			});
		}
	}

	if (splitCmd[0].replace(/[ ]/g, '') === twitterFollow) {
		var result = utils.validHints(['i', 'n'], splitCmd[1]);
		if ((result instanceof Error) || (result[0]!=undefined && result[1] != undefined)){
			//afiseaza eroarea la client
			req.session.command_output = 'Can not follow on twitter :(';
		}
		else {
			console.log('result: ' + result);
			console.log('parameters: ' + result[0] + "  "+ result[1]);
			twitterCommandHandlers.follow(req, result[0], result[1]).then(function(response){
				console.log('Minunat, ai dat follow la un dude!');
				//se transmite un mesaj la client
				req.session.command_output = 'Followed some dude!! :D';
			})
			.catch(function(){
				//se transmite mesajj de eroare la client;
				req.session.command_output = 'Can not follow on twitter :(';
			});
		}
	}

	if (splitCmd[0].replace(/[ ]/g, '') === twetterRetweet) {
		var result = utils.validHints(['i'], splitCmd[1]);
		if (result instanceof Error){
			//afiseaza eroarea la client
			req.session.command_output = 'Can not retweet on twitter :(';
		}
		else {
			twitterCommandHandlers.retweet(req, result[0]).then(function(response){
				console.log('Minunat, ai dat retweet la o mare tampenie!');
				//se transmite un mesaj la client
				req.session.command_output = 'You retweeted something!! :D';
			})
			.catch(function(){
				//se transmite mesajj de eroare la client;
				req.session.command_output = 'Can not retweet on twitter :(';
			});
		}
	}

	if (splitCmd[0].replace(/[ ]/g, '') === twitterSearch) {
		var result = utils.validHints(['m', 'p'], splitCmd[1]);
		if (result instanceof Error){
			//afiseaza eroarea la client
			req.session.command_output = 'Can not search on twitter :(';
		}
		else {
			twitterCommandHandlers.searchTweet(req, result[0]).then(function(response){
				var order = 0;
				if (result[1] !=undefined) {
					order = parseInt(result[1]);
				}
				console.log(response.statuses[order].text);
				if (response.statuses[order] != undefined){
					// se afiseaza la client ceva 
					req.session.command_output = 'Searched on twitter!! :D';
				}
				else {
					//se afiseaza eroare la client (nu avem la dispoztie atatea tweet-uri)
					req.session.command_output = 'No tweets :(';
				}
			})
			.catch(function(){
				//eroare la client
				req.session.command_output = 'Bad format :(';
			});
		}
	}

	if (splitCmd[0].replace(/[ ]/g, '') === twitterGetTweets) {
		console.log('*************************twitterGetTweets');
		var result = utils.validHints(['n', 'i', 'c'], splitCmd[1]);
		if (result instanceof Error || (result[0] != undefined && result[1]!=undefined) ||
			(result[0] === undefined && result[1] === undefined)){
			//afiseaza eroarea la client
			req.session.command_output = 'Bad format :(';
		}
		else {
			var count = 1;
			if (result[2] !=undefined) {
				count = parseInt(result[2]);
			}
			twitterCommandHandlers.getTweets(req, result[0], result[1], count).then(function(response){
				console.log(response[0]);
				if (result[0] != undefined) {
					var responseForClient = response[0].user.name + ':';
					
					var i = 0;
					while (i < count && response[i] != undefined){
						console.log(i);
						responseForClient = responseForClient + '\n  * ' + response[i].text;
						++i;
					}
					console.log(responseForClient);

					// trimite responseForClient la client
					req.session.command_output = responseForClient;
				}
				else {
					//eroare la client posibil username gresit 
					req.session.command_output = 'Twitter error :(';
				}
			})
			.catch(function(){
				//eroare la client
				req.session.command_output = 'Bad format :(';
			});
		}
	}	

	console.log(splitCmd[0] + "   " + twitterGetFriendsTweets);

	if (splitCmd[0].replace(/[ ]/g, '') === twitterGetFriendsTweets) {
		console.log('*************************twitterGetFriendsTweets');
		var result = utils.validHints(['n', 'c'], splitCmd[1]);
		if (result instanceof Error) {
			req.session.command_output = 'Twitter error :(';
			return res.redirect('/');
		}
		else {
			var count = 1;
			if (result[1] !=undefined) {
				count = parseInt(result[1]);
			}
			twitterCommandHandlers.getFriends(req, undefined, result[0], count).then(function(response) {
				console.log('callback function: ' + response.ids);
				var responseForClient = '';
				var i = 0;
				while (i < count && response.ids[i] != undefined){
					console.log(i);	
					getUserTweets(req, response.ids[i]).then(function(response) {
						responseForClient = responseForClient + '\n' + response;
						console.log(response);	
					});
					++i;
				}	
			});
		}	
	}

	return res.redirect('/');
}
