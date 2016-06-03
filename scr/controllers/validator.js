exports.isValid = function(cmd) {
  if (getSimpleCommadObject(getSimpleCommandParts(cmd)) != undefined) {
    console.log('Validare comanda simpla rezultata: ' + validateSimpleCommand(getSimpleCommadObject(getSimpleCommandParts(cmd))))
  }
  else {
    console.log('Validare comanda simpla rezultata: false');
  }
  return true;
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

function validateFacebookPostHints(commandObj) {
  console.log(commandObj.m + "***********" + commandObj.u);
  console.log(commandObj.m != undefined);
  console.log(Object.keys(commandObj).length);
  if ((commandObj.m != undefined || commandObj.u != undefined) && Object.keys(commandObj).length - 2== 2) {
    return true;
  }
  if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  if (commandObj.u != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

function validateFacebookUploadHints(commandObj) {
  if (commandObj.u != undefined) {
    if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 2) {
      return true;
    }
    if (commandObj.m == undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
    }
  }
  return false;
}

function validateFacebookAction(commandObj) {
  switch (commandObj.action) {
    case "post": return validateFacebookPostHints(commandObj); break;
    case "upload": return validateFacebookUploadHints(commandObj); break;
    default: return false; break;
  }
}

function validateMessageOnlyHints(commandObj) {
  if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

function validateTwitterIdOnlyHints(commandObj) {
  if (commandObj.i != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

function validateTwitterIdOrNameHints(commandObj) {
  if (commandObj.i != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  if (commandObj.n != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

function validateTwitterAction(commandObj) {
  switch (commandObj.action) {
    case "tweet": return validateMessageOnlyHints(commandObj); break;
    case "search": return validateMessageOnlyHints(commandObj); break;
    case "retweet": return validateTwitterIdOnlyHints(commandObj); break;
    case "follow": return validateTwitterIdOrNameHints(commandObj); break;
    default: return false; break;
  }
}

function validateYoutubeAction(commandObj) {
  switch (commandObj.action) {
    case "search": return validateMessageOnlyHints(commandObj); break;
    default: return false; break;
  }
}

function validateSimpleCommand(commandObj) {
  switch (commandObj.provider) {
    case "facebook": return validateFacebookAction(commandObj); break;
    case "twitter": return validateTwitterAction(commandObj); break;
    case "youtube": return validateYoutubeAction(commandObj); break;
    default: return false; break;
  }
}

function getSimpleCommadObject(simpleCommandParts) {
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