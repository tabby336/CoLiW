var util = require('./utils_validation');

function validateSecondCommandForGet(commandObj) {
  return (commandObj.provider === "twitter" && commandObj.action === "tweet" && util.validateNoHints(commandObj)) ||
         (commandObj.provider === "facebook" && commandObj.action === "post" && util.validateNoHints(commandObj));
}

exports.validateJokeAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "get": 
    	return util.validateNoHints(commandObj1) && 
    		   validateSecondCommandForGet(commandObj2); break;
    default: return false; break;
  }
}
