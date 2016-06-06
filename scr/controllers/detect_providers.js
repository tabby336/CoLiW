var utils = require('./utils_validation');

exports.authenticate = function(req, res) {
  var cmd = req.session.cmd;
  var splitedCommand = cmd.split('|');

  //console.log("Comanda mea este: " + cmd);
  //console.log(req.session.oauth);

  var obj1 = utils.getCommadObject(splitedCommand[0]);
  if (obj1 != undefined && (req.session.oauth === undefined || 
  							!req.session.oauth.hasOwnProperty(obj1.provider.toString().trim()))) {
  	res.redirect('/' + obj1.provider);
    return;
  } 

  var obj2 = undefined;
  if (splitedCommand.length == 2) {
    obj2 = utils.getCommadObject(splitedCommand[1]);
    if (obj2 != undefined && (req.session.oauth === undefined || 
                !req.session.oauth.hasOwnProperty(obj2.provider.toString().trim()))) {
      res.redirect('/' + obj2.provider);
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
  res.redirect('/command');
}
