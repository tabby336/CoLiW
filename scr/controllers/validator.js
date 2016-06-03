var simpleCommandValidator = require('./simple_command_validator');

exports.isValid = function(cmd) {
  console.log('RESULT: ' + simpleCommandValidator.validateSimpleCommand(cmd));
}