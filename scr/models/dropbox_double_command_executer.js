var simpleCommandExecuter = require('./facebook_simple_command_executer');
var dropboxCommandHandlers = require('./dropbox_command_handlers');
var utils = require('./utils.js');

const facebookPostPhoto = "facebookpostphoto";
const dropboxGet = "dropboxget";

var appendToSecondCommand = function (secondCommand, hints) {
	console.log('secondCommand apend fct' + secondCommand + hints);
	if (secondCommand.indexOf('&&') === -1) {
		secondCommand = secondCommand + '&&';
	}

	console.log('secondCommand: ' + secondCommand);
	return secondCommand + hints;
}

function dropboxDownloadFirst(req, splitedFirstCommand, secondCommand) {
	var result = utils.validHints(['p'], splitedFirstCommand[1]);
	if (result instanceof Error){
		//afiseaza eroarea la client
	}
	else {
		console.log("incerc sa descarc " + result[0]);
		dropboxCommandHandlers.getFile(req, result[0].replace(/[ ]/g, '')).then(function(response){
			console.log("**********");
			if (secondCommand.replace(/[ ]/g, '')  === facebookPostPhoto && result[0] != undefined) {
				simpleCommandExecuter.singleCommandExecute(req, secondCommand + '&& p<<' + response, false);
			}
			else {
				//comanda nu a fost formatata bine
			}
		})
		.catch(function(){
			//eroare la client
		});
	}
}

exports.doubleCommandExecute = function(req, commad) {
	console.log("doubleCommandExecute");
	var firstCommand = commad[0];
	var splitedFirstCommand = firstCommand.split('&&');
	var secondCommand = commad[1];
	var splitedSecondCommand = secondCommand.split('&&');

	if (splitedFirstCommand[0].replace(/[ ]/g, '') === dropboxGet) {
		dropboxDownloadFirst(req, splitedFirstCommand, secondCommand);
	}
	else {
		// nu se poate procesa o asemenea comanda inlantuita
	}
}