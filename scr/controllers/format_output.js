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
	var auxiliaryURL = 'https://www.youtube.com/watch?v=' + obj.id.videoId ;
	var url = 'URL: ' + auxiliaryURL;
	return '<pre class="ok">' + name + url + '</pre>';
}