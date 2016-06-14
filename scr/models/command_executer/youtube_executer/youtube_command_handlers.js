var YouTube = require('youtube-node');

exports.search = function(req, text) {
	return new Promise(function(resolve, reject) {
		var youTube = new YouTube();
		youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
		youTube.search(text, 20, function(error, result) {
	  	if (error) {
	    	console.log(error);
	    	reject(error);
	  	}
	  	else {
	    	resolve(result);
	  	}
		});
	});
}