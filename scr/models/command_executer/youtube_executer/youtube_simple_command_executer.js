var youtubeCommandHandlers = require('./youtube_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

function formatFoundVideos(response) {
	var responseForClient = '';
	var i = 0;
	console.log(response);
	while (response[i] != undefined) {
		if (response[i].id.videoId != undefined) {
			responseForClient = responseForClient + outputFormat.youtubeSearchFormat(response[i]);
		}
		++i;
	}
	return responseForClient;
}

function search(req, res, obj) {
	youtubeCommandHandlers.search(req, obj.m).then(function(response){
		console.log('Minunat, ai gasit o melodie wow!');
		toClient.send(req, res, formatFoundVideos(response.items));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred.'));
	});
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "search": search(req, res, obj); break;
	}
}

