
exports.validHints = function (hintsCode, actualHints) {
	console.log("validPostTweetHints: " + actualHints);
	var splitHints = actualHints.split('**');
	var hintsArray = [];

	console.log(splitHints);
	
	for (i = 0; i < hintsCode.length; ++i) {
		for (j = 0; j < splitHints.length; ++j) {
			if (splitHints[j].replace(/[ ]/g, '').substring(0, 1) === hintsCode[i]) {
				hintsArray[i] = splitHints[j].split('<<')[1];
				break;
			}
		}
	}
	console.log('***');
	console.log('***');
	console.log('***');
	console.log("My hints: " + hintsArray);
	if (hintsArray === []) {
		return new Error("Your commands parameters are not the expected ones.");
	}

	return hintsArray;
}

exports.appendToSecondCommand = function (secondCommand, hints) {
	console.log('secondCommand apend fct' + secondCommand + hints);
	if (secondCommand.indexOf('&&') === -1) {
		secondCommand = secondCommand + '&&';
	}
	else {
		secondCommand = secondCommand + '**';
	}

	console.log('secondCommand: ' + secondCommand);
	return secondCommand + hints;
}