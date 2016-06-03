var util = require('./utils_validation');

exports.validateYoutubeAction = function(commandObj) {
  switch (commandObj.action) {
    case "search": return util.validateMessageOnlyHints(commandObj); break;
    default: return false; break;
  }
}
