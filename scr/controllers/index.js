var rendering = require('../util/rendering');


exports.home = function(req, res) {
    console.log('ceva ' + req.query.cmd);
    if(req.query.cmd !== undefined) {
      console.log("THE COMMAND: " + req.query.cmd);
      req.session.cmd = req.query.cmd;
      res.redirect('/authProviders');
      return;
    }

    res.render('index/index2');
}


exports.userHome = function(req, res) {
    res.render('index/user-home');
}


exports.successAuth = function(req, res) {
  res.render('index/success');
}