var rendering = require('../util/rendering'),
    db = require('../models/history');


// Function used when accessing home (/)
exports.home = function(req, res) {
    if(req.query.cmd !== undefined) {
      console.log("THE COMMAND: " + req.query.cmd);
      req.session.cmd = req.query.cmd;
      res.redirect('/authProviders');
      return;
    }
    
    db.getUsername(req.session.passport.user, function(result) {
    	console.log(result);
    	res.render('index/index2', {username: result});
    })
    
}

// Function used to inject some js to close the provider popup.
exports.successAuth = function(req, res) {
  res.render('index/success');
}