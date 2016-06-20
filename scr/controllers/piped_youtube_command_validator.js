var util = require('./utils_validation');

// Function used to validate commands containing 'youtube' as the second part of the pipe
function validateSecondCommandForSearch(commandObj) {
  return (commandObj.provider === "twitter" && commandObj.action === "tweet" && util.validateMaybeMessage(commandObj)) ||
         (commandObj.provider === "facebook" && commandObj.action === "post" && util.validateMaybeMessage(commandObj));
}

// Actual validator
exports.validateYoutubeAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "search": 
    	return util.validateMessageAndMaybePositionHints(commandObj1) && 
    		   validateSecondCommandForSearch(commandObj2); break;
    default: return false; break;
  }
}
