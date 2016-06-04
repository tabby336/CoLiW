var simpleCommandValidator = require('./simple_command_validator');

exports.isValid = function(cmd) {
	var numberOfCommands = cmd.split('|').length ;
	console.log('numberOfCommands: ' + numberOfCommands);
	if (numberOfCommands == 1) {
		console.log('RESULT: ' + simpleCommandValidator.validateSimpleCommand(cmd));
	}
	else if (numberOfCommands == 2) {

	}
	else {
		console.log('Not suported yet');
	}

}