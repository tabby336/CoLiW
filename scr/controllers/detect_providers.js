var utils = require('./utils_validation');

function next(res) {
console.log("\n*\n" + JSON.stringify(res.headers));
}

function getProvider(partialName) {
  switch (partialName) {
    case 'calendar': return 'google_calendar';
    case 'gmail': return 'google_mail';
    case 'joke': return undefined;
    case 'youtube': return undefined;
    default: return partialName;
  }
}

exports.authenticate = function(req, res) {
  var cmd = req.session.cmd;
  var splitedCommand = cmd.split('|');

  //console.log("Comanda mea este: " + cmd);
 // console.log(req.session.oauth);

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
    if (obj2 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(provider2.toString().trim()))) {
      res.status(412).end(provider2);
      return;
    } 
  }
  res.redirect('/command');
  return;
};

exports.afterAnAuthentication = function(req, res) {
  var splitedCommand = req.session.cmd.split('|');
  var obj2 = undefined;
  if (splitedCommand.length == 2) {
    obj2 = utils.getCommadObject(splitedCommand[1]);
    if (obj2 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(obj2.provider.toString().trim()))) {
      res.redirect('/' + obj2.provider);
      return;
    } 
  }
  res.redirect('/successAuth');
  //res.redirect('/command');
}
