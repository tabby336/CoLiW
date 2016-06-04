var util = require('./utils_validation');

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

exports.validateTwitterAction = function(commandObj1, commandObj2) {
  switch (commandObj1.action) {
    case "search": 
    	return util.validateMessageAndPositionHints(commandObj1) && 
    		   validateSecondCommandForSearch(commandObj2); break;
    default: return false; break;
  }
}
