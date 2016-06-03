var facebook = require('./simple_facebook_command_validator');
var twitter = require('./simple_twitter_command_validator');
var youtube = require('./simple_youtube_command_validator');

exports.validateSimpleCommand = function(cmd) {
  commandObj = getSimpleCommadObject(cmd);
  if (commandObj == undefined) return false;
  
  switch (commandObj.provider) {
    case "facebook": return facebook.validateFacebookAction(commandObj); break;
    case "twitter": return twitter.validateTwitterAction(commandObj); break;
    case "youtube": return youtube.validateYoutubeAction(commandObj); break;
    default: return false; break;
  }
}

function cutQuote(text) {
  return text.replace(/["]/g, ' ').trim().toString();
}

function addToCommandObj(commandObj, hint, hintValue) {
  console.log(hint + " -> " + hintValue);
  switch (hint.toString().trim()) {
    case "-m": console.log("m"); commandObj.m = cutQuote(hintValue); break;
    case "-i": console.log("i"); commandObj.i = cutQuote(hintValue); break;
    case "-p": console.log("p"); commandObj.p = cutQuote(hintValue); break;
    case "-n": console.log("n"); commandObj.n = cutQuote(hintValue); break;
    case "-u": console.log("u"); commandObj.u = cutQuote(hintValue); break;
    default: return undefined;
  }
  return commandObj;
}

function getSimpleCommadObject(cmd) {
  var simpleCommandParts = getSimpleCommandParts(cmd);
  var commandObj = {};

  commandObj.provider = simpleCommandParts[0].toString().trim();
  commandObj.action = simpleCommandParts[1].toString().trim();

  console.log("simple Command Parts:   " +  simpleCommandParts);
  console.log('Jsonul pentru comanda inainte de for: ' + JSON.stringify(commandObj));

  for (var i = 2; i < simpleCommandParts.length; i+=2) {
    commandObj = addToCommandObj(commandObj, simpleCommandParts[i], simpleCommandParts[i+1]);
    if (commandObj == undefined) {
      return undefined;
    }
  }

  console.log('Jsonul pentru comanda: ' + JSON.stringify(commandObj));
  return commandObj;
}

function getSimpleCommandParts(cmd) {
  var nextString = "";
  var isQuote = false;
  var commandParts = [];

  for (var i = 0; i < cmd.length; ++i) {
    item = cmd[i];
    switch (item) {
      case '\"': 
        nextString += item; 
        isQuote = !isQuote; 
        if (isQuote == false) {
        //  console.log('Adaug 2' + nextString);
          commandParts.push(nextString.trim());
          nextString = "";
        }
      break;
      case ' ': 
        if (!isQuote) {
          if (nextString.trim() != "") {
          //  console.log('Adaug1 ' + nextString);
            commandParts.push(nextString.trim());
            nextString = "";
          }
          else {
          //  console.log("****" + nextString + "Ceva ciudat se intampla");
          }
        }
        else {
          nextString += item;
        }
      default: nextString += item;
    }
  }
  if (nextString.trim()) {
    commandParts.push(nextString.trim())
  }
  return commandParts;
}