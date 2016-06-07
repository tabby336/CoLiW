var simpleCommandValidator = require('./simple_command_validator');
var pipedCommandValidator =  require('./piped_commad_validator');

exports.isValid = function(cmd) {
	var numberOfCommands = cmd.split('|').length ;
	var status = false;
	console.log('numberOfCommands: ' + numberOfCommands);
	if (numberOfCommands == 1) {
		status = simpleCommandValidator.validateSimpleCommand(cmd);
		console.log('RESULT: ' + status);
	}
	else if (numberOfCommands == 2) {
		status = pipedCommandValidator.validatePipedCommand(cmd);
		console.log('RESULT 2: ' + status);
	}
	else {
		console.log('Not suported yet');
	}


	return status;
}