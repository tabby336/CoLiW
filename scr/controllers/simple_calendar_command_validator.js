var util = require('./utils_validation');


// Function used to check if the action for google calendar is a valid one
exports.validateCalendarAction = function(commandObj) {
	console.log("##############Va valida calendarul  " + JSON.stringify(commandObj));
  switch (commandObj.action) {
    case "events": return validateMaybeDateOrCountHints(commandObj); break;
    case "insert": return validateInsertParameter(commandObj) && validateInsertParameterValue(commandObj); break;
    default: return false; break;
  }
}

/*
 Helper functions
 */


 // Function validates if the insert has correct parameters
function validateInsertParameter(commandObj) {
	var nrUnits = 3;
	nrUnits += commandObj.hasOwnProperty('s') ? 1 : 0;
	nrUnits += commandObj.hasOwnProperty('l') ? 1 : 0;
	return (commandObj.hasOwnProperty('p') ^ commandObj.hasOwnProperty('d')) && 
		   (Object.keys(commandObj).length == nrUnits);
}

// Function validates the content of the parameters
function validateInsertParameterValue(commandObj) {
	if (commandObj.d != undefined) {
		return util.getDateValid(commandObj.d) != undefined;
	}
	var interval = commandObj.p.split('-');
	interval[0] = util.getValidDateJSON(interval[0]);
	interval[1] = util.getValidDateJSON(interval[1]);
	if (interval[0] == undefined || interval[1] == undefined) {
		return false;
	}
	return true;
}

function validateMaybeDateOrCountHints(commandObj) {
	var nrUnits = 2;
	nrUnits += commandObj.hasOwnProperty('d') ? 1 : 0;
	nrUnits += commandObj.hasOwnProperty('c') ? 1 : 0;
	return Object.keys(commandObj).length == nrUnits;
}

