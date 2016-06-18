exports.validateMessageOnlyHints = function(commandObj) {
  if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

exports.validateMaybeMessage = function(commandObj) {
  return (commandObj.m != undefined && Object.keys(commandObj).length == 3) || 
          Object.keys(commandObj).length == 2;
}

exports.validaterIdOnlyHints = function(commandObj) {
  if (commandObj.i != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

exports.validateIdOrNameHints = function(commandObj) {
  if (commandObj.i != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  if (commandObj.n != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
}

exports.validateMessageAndPositionHints = function(commandObj) {
  if (commandObj.m != undefined && commandObj.p !=undefined && Object.keys(commandObj).length == 4) {
    return true;
  }
  return false;
}

exports.validateMessageAndMaybePositionHints = function(commandObj) {
  return (Object.keys(commandObj).length == 3 && commandObj.m != undefined) ||
         (Object.keys(commandObj).length == 4 && commandObj.m != undefined && commandObj.p != undefined);
}

exports.validateNoHints = function(commandObj) {
  return Object.keys(commandObj).length == 2;
}

exports.validateMessageAndMaybePositionHints = function(commandObj) {
  return commandObj.m != undefined &&
         ((commandObj.p != undefined && Object.keys(commandObj).length == 4) ||
          (commandObj.p == undefined && Object.keys(commandObj).length == 3) );
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
    case "-c": console.log("c"); commandObj.c = cutQuote(hintValue); break;
    case "-d": console.log("d"); commandObj.d = cutQuote(hintValue); break;
    case "-s": console.log("s"); commandObj.s = cutQuote(hintValue); break;
    case "-l": console.log("l"); commandObj.l = cutQuote(hintValue); break;
    default: return undefined;
  }
  return commandObj;
}

exports.getCommadObject = function(cmd) {
  var simpleCommandParts = getSimpleCommandParts(cmd);
  var commandObj = {};

  if (simpleCommandParts.length < 2 || simpleCommandParts.length % 2 != 0) return undefined;

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

exports.isDateValid = function(date) {
  if (!isIntOrSpace(commandObj.d)) return false;
  var units = commandObj.d.trim().split(/\s+/).length;
  if (units.length != 3) return false;
  return isNaN(Date.parse(units[2] + " " + units[1] + " " + units[0]));
}

exports.getValidDateJSON = function(date) {
  if (!isIntOrSpacel(date)) return false;
  var units = date.trim().split(/\s+/);
  if (units.length != 5) return undefined;
  var obj = {
              'day': units[2] + " " + units[1] + " " + units[0],
              'hour': parseInt(units[3]) > -1 && parseInt(units[3]) < 24 ? parseInt(units[3]) : -1,
              'minutes': parseInt(units[3]) > -1 && parseInt(units[3]) <  60 ? parseInt(units[4]) : -1
            }

  if (isNaN(Date.parse(obj.day)) || obj.hour == -1 || obj.minutes == -1) {
      return undefined;
  }

  return obj;
}


function isIntOrSpacel(value) {
  value = value.trim();
  for (var i = 0; i < value.length; ++i) {
    if ((value[i] < '0'  && value[i] != ' ') || value[i] > '9') return false;
  }
  return true;
}

exports.isInt = function(value) {
  value = value.trim();
  for (var i = 0; i < value.length; ++i) {
    if (value[i] < '0' || value[i] > '9') return false;
  }
  return true;
}

function isIntOrSpace(value) {
  value = value.trim();
  for (var i = 0; i < value.length; ++i) {
    if ((value[i] < '0'  && value[i] != ' ') || value[i] > '9') return false;
  }
  return true;
}

exports.transform = function(date) {
  var partsOfDate = date.split(' ');
  var partsOfDateOk = [];
  for (var i = 0; i < partsOfDate.length; ++i) {
    if (partsOfDate[i] != '') {
      partsOfDateOk.push(partsOfDate[i]);
    }
  }
  if (partsOfDateOk.length != 3) return 'x';
  return partsOfDateOk[2] + " " + partsOfDateOk[1] + " " + partsOfDateOk[0];
}
