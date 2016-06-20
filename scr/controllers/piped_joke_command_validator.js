var util = require('./utils_validation');

// Function used to validate commands containing 'joke' as the second part of the pipe
function validateSecondCommandForGet(commandObj) {
  return (commandObj.provider === "twitter" && commandObj.action === "tweet" && util.validateNoHints(commandObj)) ||
         (commandObj.provider === "facebook" && commandObj.action === "post" && util.validateNoHints(commandObj)) ||
     	 (commandObj.provider === "gmail" && commandObj.action === "send" && util.validateToOnlyHints(commandObj));
}

// Actual validator
exports.validateJokeAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "get": 
    	return util.validateNoHints(commandObj1) && 
    		   validateSecondCommandForGet(commandObj2); break;
    default: return false; break;
  }
}
