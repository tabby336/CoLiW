var YouTube = require('youtube-node');

var Promise = require('es6-promise').Promise;

exports.help = function(req, res) {
	var help = '<div>' + 
                  '<p> <b>Youtube commands:<b> </p> <br>' +

                  '<br>' + 

                  '&nbsp; youtube <b>search</b> -m "message" <br>' +
                  '&nbsp;&nbsp;&nbsp; -m argument is mandatory, returns first 20 results. <br>' +

                  '<br>' +

                  '&nbsp; Youtube commands can also be pipped with twitter and facebook post. <br>' + 

                  '<br><br>'  +

               '</div>';
    return help;
}

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