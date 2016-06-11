var rendering = require('../util/rendering');


exports.home = function(req, res) {
    console.log('ceva ' + req.query.cmd);
    if(req.query.cmd !== undefined) {
      console.log("THE COMMAND: " + req.query.cmd);
      req.session.cmd = req.query.cmd;
      res.redirect('/authProviders');
      return;
    }

    var user_id = req.session.passport.user;
    if(user_id > 0) {
      command_output = '';
      if(typeof req.session.command_output !== undefined) {
        console.log('have command output');
        command_output = req.session.command_output;
        console.log("REQ CMD OUTPUT: " + req.session.command_output);
        delete req.session['command_output'];

      }
      res.render('index/index2', {username: req.session.username, output: command_output});
    } else {
      command_output = req.session.command_output;
      res.render('index/index2', {username: 'guest', output: 'Must be logged in to execute commands!!'});
    }
}


exports.userHome = function(req, res) {
    res.render('index/user-home');
}
