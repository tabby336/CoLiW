exports.validateMessageOnlyHints = function(commandObj) {
  if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
  }
  return false;
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