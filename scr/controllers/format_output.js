exports.errorMessage = function(input) {
	return '<p class="error">' + input + '</p>';
}

exports.okMessage = function(input){
	return '<p class="ok">' + input + '</p>';
}

exports.tweetsFromSearch = function(tweet) {
	var id = 'Tweet id: ' + '<span class="copy">' + tweet.id + '</span>'+ '\n';
	var text = 'Text: ' + tweet.text + '\n';
	var user = 'Username: ' + tweet.user.screen_name + '\n';
	var retweets = 'Number of retweets: ' + tweet.retweet_count + '\n';
	return '<pre class="ok">' + id + text + user + retweets + '</pre>';
}

exports.youtubeSearchFormat = function(obj) {
	var name = 'Title: ' + obj.snippet.title + '\n';
	var auxiliaryURL = 'https://www.youtube.com/watch?v=' + obj.id.videoId;
	var url = 'URL: <a href="' + auxiliaryURL +'">' + auxiliaryURL + "</a>";
	return '<pre class="ok">' + name + url + '</pre>';
}

exports.calendarEventFormat = function (obj) {
	var description = obj.description != undefined ? 'Description: ' + obj.description + '\n' : '';
	var summary = obj.summary != undefined ? 'Summary: ' + obj.summary + '\n' : '';
	var location = obj.location != undefined ? 'Location: ' + obj.location + '\n' : '';
	var startTime = obj.start.dateTime != undefined ? 'Start time: ' + obj.start.dateTime + '\n' : 
													  'Start time: ' + obj.start.date + '\n' ;
	var endTime = obj.end.dateTime != undefined ? 'End time: ' + obj.end.dateTime + '\n' :
												  'End time: ' + obj.end.date + '\n' ;
	console.log('<pre class="ok">' + description + location + startTime + endTime + '</pre>');
	return '<pre class="ok">' + description + summary + location + startTime + endTime + '</pre>';
}