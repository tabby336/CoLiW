// Helper function
function validateSendHints(commandObj) {
	var nrUnits = 3;
	nrUnits += commandObj.hasOwnProperty('s') ? 1 : 0;
	nrUnits += commandObj.hasOwnProperty('c') ? 1 : 0;
	return (commandObj.hasOwnProperty('t')  && Object.keys(commandObj).length == nrUnits);
	return true;
}

// Function validates the gmail action
exports.validateGmailAction = function(commandObj) {
  switch (commandObj.action) {
    case "send": return validateSendHints(commandObj); break;
    default: return false; break;
  }
}