var facebook = require('./simple_facebook_command_validator');
var twitter = require('./simple_twitter_command_validator');
var youtube = require('./simple_youtube_command_validator');
var calendar = require('./simple_calendar_command_validator');
var joke = require('./simple_joke_command_validator');
var utils = require('./utils_validation');
var gmail = require('./simple_gmail_command_validator');

// Name self explanatory
exports.validateSimpleCommand = function(cmd) {
  commandObj = utils.getCommadObject(cmd);
  if (commandObj == undefined) return false;
  
  switch (commandObj.provider) {
    case "facebook": return facebook.validateFacebookAction(commandObj); break;
    case "twitter": return twitter.validateTwitterAction(commandObj); break;
    case "youtube": return youtube.validateYoutubeAction(commandObj); break;
    case "calendar": return calendar.validateCalendarAction(commandObj); break;
    case "joke": return joke.validateJokeAction(commandObj); break;
    case "gmail": return gmail.validateGmailAction(commandObj); break;
    default: return false; break;
  }
}