var twitter = require('./piped_twitter_command_validator');
var youtube = require('./piped_youtube_command_validator');
var joke = require('./piped_joke_command_validator');
var utils = require('./utils_validation');


// Name self explanatory
exports.validatePipedCommand = function(cmd) {
  var commandParts = cmd.split('|');
  console.log('***commandParts: ' + commandParts);
  commandObj1 = utils.getCommadObject(commandParts[0]);
  commandObj2 = utils.getCommadObject(commandParts[1]);

  if (commandObj1 == undefined || commandObj2 == undefined) return false;
  
  switch (commandObj1.provider) {
    case "twitter": return twitter.validateTwitterAction(commandObj1, commandObj2); break;
    case "youtube": return youtube.validateYoutubeAction(commandObj1, commandObj2); break;
    case "joke": return joke.validateJokeAction(commandObj1, commandObj2); break;
    default: return false; break;
  }
}