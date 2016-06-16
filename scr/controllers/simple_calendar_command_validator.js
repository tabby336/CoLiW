var util = require('./utils_validation');

filterInt = function (value) {
  if(/[0-9]+/.test(value))
    return Number(value);
  return NaN;
}

function transform(date) {
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

function validateMaybeDateOrCountHints(commandObj) {
	if (commandObj.d != undefined) {
		var newDateFormat = transform(commandObj.d);
		var x =  Date.parse(newDateFormat);
		if (isNaN(Date.parse(newDateFormat))) {
			commandObj.d = newDateFormat;
			return false;
		}	
	}  
	//console.log('$%^&*(*&^%$#@#$%^&*&^%$#@Q \n\n' + parseInt(commandObj.c));
	if (commandObj.c != undefined && isNaN(filterInt(commandObj.c))) {
		return false;
	}
	return (Object.keys(commandObj).length == 4 && commandObj.d != undefined && commandObj.c != undefined) ||
	       (Object.keys(commandObj).length == 3 && commandObj.d != undefined) ||
	       (Object.keys(commandObj).length == 3 && commandObj.c != undefined) ||
	       (Object.keys(commandObj).length == 2);
}

exports.validateCalendarAction = function(commandObj) {
	//console.log("##############Va valida calendarul  " + JSON.stringify(commandObj));
  switch (commandObj.action) {
    case "events": return validateMaybeDateOrCountHints(commandObj); break;
    default: return false; break;
  }
}
