var util = require('./utils_validation');

exports.validateTwitterAction = function(commandObj) {
  switch (commandObj.action) {
    case "tweet": return util.validateMessageOnlyHints(commandObj); break;
    case "search": return util.validateMessageOnlyHints(commandObj); break;
    case "retweet": return util.validateIdOnlyHints(commandObj); break;
    case "follow": return util.validateIdOrNameHints(commandObj); break;
    case "activity": return util.validateIdOrNameHints(commandObj); break;
    default: return false; break;
  }
}
