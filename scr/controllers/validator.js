var simpleCommandValidator = require('./simple_command_validator');
var pipedCommandValidator =  require('./piped_commad_validator');

exports.isValid = function(cmd) {
	var numberOfCommands = cmd.split('|').length ;
	console.log('numberOfCommands: ' + numberOfCommands);
	if (numberOfCommands == 1) {
		console.log('RESULT: ' + simpleCommandValidator.validateSimpleCommand(cmd));
	}
	else if (numberOfCommands == 2) {
		console.log('RESULT 2: ' + pipedCommandValidator.validatePipedCommand(cmd));
	}
	else {
		console.log('Not suported yet');
	}

}