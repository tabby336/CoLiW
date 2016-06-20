var util = require('./utils_validation');

// Function used to validate commands containing 'twitter' as the second part of the pipe
function validateSecondCommandForSearch(commandObj) {
  if (commandObj.provider === "twitter") {
	  switch (commandObj.action) {
	    case "retweet": return util.validateNoHints(commandObj); break;
	    case "follow": return util.validateNoHints(commandObj); break;
	    default: return false; break;
	  }
  }
  return false;
}

// Actual validator
exports.validateTwitterAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "search": 
    	return util.validateMessageAndMaybePositionHints(commandObj1) && 
    		   validateSecondCommandForSearch(commandObj2); break;
    default: return false; break;
  }
}


