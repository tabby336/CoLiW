var utils = require('./utils_validation');

exports.authenticate = function(req, res) {
  var cmd = req.session.cmd;
  var splitedCommand = cmd.split('|');

  console.log("Comanda mea este: " + cmd);
  //console.log("RES este *********** ");
  console.log(req.session.oauth);

  var obj1 = utils.getCommadObject(splitedCommand[0]);
  var obj2 = undefined;
  if (splitedCommand.length == 2) {
  	obj2 = utils.getCommadObject(splitedCommand[1]);
  }
//  console.log('provider: ' + obj1.provider);
  //console.log('test2: ' + req.session.oauth.hasOwnProperty(obj1.provider.toString().trim()));
  if (obj1 != undefined && (req.session.oauth === undefined || 
  							!req.session.oauth.hasOwnProperty(obj1.provider.toString().trim()))) {
  	res.redirect('/' + obj1.provider);
  } 

  if (obj2 != undefined && (req.session.oauth === undefined || 
  							!req.session.oauth.hasOwnProperty(obj1.provider.toString().trim()))) {
  	res.redirect('/' + obj2.provider);
  } 

  req.session.cmd === '!!!!?!!!!'

  console.log('GATAAAAAA!!!' + JSON.stringify(req.session.oauth));
};