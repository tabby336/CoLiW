var rendering = require('../util/rendering'),
    db = require('../models/history');

exports.home = function(req, res) {
    if(req.query.cmd !== undefined) {
      console.log("THE COMMAND: " + req.query.cmd);
      req.session.cmd = req.query.cmd;
      res.redirect('/authProviders');
      return;
    }
    //console.log("LALA " + db.getUsername(req.session.passport.user));
    db.getUsername(req.session.passport.user, function(result) {
    	console.log(result);
    	res.render('index/index2', {username: result});
    })
    //res.render('index/index2');
}

exports.successAuth = function(req, res) {
  res.render('index/success');
}