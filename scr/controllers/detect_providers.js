var utils = require('./utils_validation');

function next(res) {
  console.log("\n*\n" + JSON.stringify(res.headers));
}

// Function used to get the provider in a OauthIO friendly way
function getProvider(partialName) {
  switch (partialName) {
    case 'calendar': return 'google_calendar'; // actual oauth provider name
    case 'gmail': return 'google_mail'; 
    case 'joke': return undefined; // does not require login
    case 'youtube': return undefined; 
    default: return partialName; // same as in the command
  }
}

// Function check if there is any more authentication to do with providers from the command
exports.authenticate = function(req, res) {
  var cmd = req.session.cmd;
  var splitedCommand = cmd.split('|');

  var obj1 = utils.getCommadObject(splitedCommand[0]);
  var provider1 = getProvider(obj1.provider);
  if (provider1 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(provider1.toString().trim()))) {
  	res.status(412).end(provider1);
    return;
  } 
  
  var obj2 = undefined;
  if (splitedCommand.length == 2) {
    obj2 = utils.getCommadObject(splitedCommand[1]);
    var provider2 = getProvider(obj2.provider);
    console.log('********************\n' +  provider2);
    console.log('********************');
    if (obj2 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(provider2.toString().trim()))) {
      res.status(412).end(provider2);
      return;
    } 
  }
  res.redirect('/command');
  return;
};

// Redirected here if there's need for the second auth with providers
exports.afterAnAuthentication = function(req, res) {
  var splitedCommand = req.session.cmd.split('|');
  var obj2 = undefined;
  if (splitedCommand.length == 2) {
    obj2 = utils.getCommadObject(splitedCommand[1]);
    var provider2 = getProvider(obj2.provider);
    if (obj2 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(provider2))) {
      res.status(412).end(provider2);
      return;
    } 
  }
  res.redirect('/successAuth');
}
