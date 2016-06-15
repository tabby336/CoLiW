var util = require('./utils_validation');

function validateSecondCommandForSearch(commandObj) {
  return (commandObj.provider === "twitter" && commandObj.action === "tweet" && util.validateMaybeMessage(commandObj)) ||
         (commandObj.provider === "facebook" && commandObj.action === "post" && util.validateMaybeMessage(commandObj));
}

exports.validateYoutubeAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "search": 
    	return util.validateMessageAndMaybePositionHints(commandObj1) && 
    		   validateSecondCommandForSearch(commandObj2); break;
    default: return false; break;
  }
}
