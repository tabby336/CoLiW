var util = require('./utils_validation');

exports.validateCalendarAction = function(commandObj) {
	console.log("##############Va valida calendarul  " + JSON.stringify(commandObj));
  switch (commandObj.action) {
    case "events": return validateMaybeDateOrCountHints(commandObj); break;
    case "insert": return validateInsertParameter(commandObj) && validateInsertParameterValue(commandObj); break;
    default: return false; break;
  }
}

function validateInsertParameter(commandObj) {
	var nrUnits = 3;
	nrUnits += commandObj.hasOwnProperty('s') ? 1 : 0;
	nrUnits += commandObj.hasOwnProperty('l') ? 1 : 0;
	return (commandObj.hasOwnProperty('p') ^ commandObj.hasOwnProperty('d')) && 
		   (Object.keys(commandObj).length == nrUnits);
}

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

