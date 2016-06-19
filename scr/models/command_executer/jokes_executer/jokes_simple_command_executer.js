var jokeCommandHandlers = require('./jokes_command_handler');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

function get(req, res, obj) {
  jokeCommandHandlers.getJoke(req, res, undefined, undefined).then(function(response) {
    toClient.send(req, res, outputFormat.okMessage(response));
  }).catch(function(error){
    toClient.send(req, res, outputFormat.errorMessage('An error has occured'));
  });
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "get": get(req, res, obj); break;
	}
}



  