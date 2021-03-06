
// Function ued to validate the format a facebook command
exports.validateFacebookAction = function(commandObj) {
  switch (commandObj.action) {
    case "post": return validateFacebookPostHints(commandObj); break;
    case "upload": return validateFacebookUploadHints(commandObj); break;
    default: return false; break;
  }
}


/*
  Helper functions
*/

// Function validates the post hints (message, url)
function validateFacebookPostHints(commandObj) {
  console.log(commandObj.m + "***********" + commandObj.u);
  console.log(commandObj.m != undefined);
  console.log(Object.keys(commandObj).length);
  if ((commandObj.m != undefined && commandObj.u != undefined) && Object.keys(commandObj).length - 2 == 2) {
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


// Function validates the upload hints (url, message)
function validateFacebookUploadHints(commandObj) {
  if (commandObj.u != undefined ^ commandObj.p !=undefined) {
    if (commandObj.m != undefined && Object.keys(commandObj).length - 2 == 2) {
      return true;
    }
    if (commandObj.m == undefined && Object.keys(commandObj).length - 2 == 1) {
    return true;
    }
  }
  return false;
}

// Function validates the action
function validateFacebookAction(commandObj) {
  switch (commandObj.action) {
    case "post": return validateFacebookPostHints(commandObj); break;
    case "upload": return validateFacebookUploadHints(commandObj); break;
    default: return false; break;
  }
}