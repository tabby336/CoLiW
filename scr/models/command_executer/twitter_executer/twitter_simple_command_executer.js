var twitterCommandHandlers = require('./twitter_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

const twitterFollow = "twitterfollow";
const twitterTweet = "twittertweet"
const twitterSearch = "twittersearch";
const twetterRetweet = "twitterretweet";
const twitterGetTweets = "twittergettweets";
const twitterGetFriendsTweets = "twittergetfriendstweets";

function tweet(req, res, obj) {
	twitterCommandHandlers.postTweet(req, obj.m).then(function(response){
		console.log('Minunat, ai postat pe twitter!');
		toClient.send(req, res, outputFormat.okMessage('You have posted a new tweet!'));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

function follow(req, res, obj) {
	twitterCommandHandlers.follow(req, obj.i, obj.n).then(function(){
		console.log('Minunat, ai dat follow la un dude!');
		toClient.send(req, res, outputFormat.okMessage('You just followed someone on twitter!'));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

function retweet(req, res, obj) {
	twitterCommandHandlers.retweet(req, obj.i).then(function(response){
		console.log('Minunat, ai dat retweet la o mare tampenie!');
		toClient.send(req, res, outputFormat.okMessage('You have just retweeted a tweet!'));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

function formatTwitterTweets(response) {
	var responseForClient = '';
	var i = 0;
	while (response[i] != undefined) {
		console.log('get responses');
		responseForClient = responseForClient + outputFormat.tweetsFromSearch(response[i]);
		++i;
	}
	return responseForClient;
}

function search(req, res, obj) {
	twitterCommandHandlers.searchTweet(req, obj.m).then(function(response){
		toClient.send(req, res, formatTwitterTweets(response.statuses));
	})
	.catch(function(){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

function activity(req, res, obj) {
	console.log('activity');
	console.log(obj);
	twitterCommandHandlers.getTweets(req, obj.n, obj.i).then(function(response){
		console.log(response[0]);
		toClient.send(req, res, formatTwitterTweets(response));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error[0].message));
	});
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "tweet": tweet(req, res, obj); break;
		case "follow": follow(req, res, obj); break;
		case "retweet": retweet(req, res, obj); break;
		case "search": search(req, res, obj); break;
		case "activity": activity(req, res, obj); break;
	}

	/*
		

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

	return res.redirect('/');*/
}
