var YouTube = require('youtube-node');

exports.search = function(req, text) {
	return new Promise(function(resolve, reject) {
		var youTube = new YouTube();

		youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
		console.log('sunt in youtube');

		youTube.search(text, 20, function(error, result) {
	  	if (error) {
	    	console.log("CACA YT: " + error);
	    	reject();
	  	}
	  	else {
	    	console.log(JSON.stringify(result, null, 2));
	    	resolve(result);
	  	}
		});
	});
}