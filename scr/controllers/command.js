var loginController = require('./login');
var commandValidator = require('./validator');
var authentication_handler = require('./detect_providers');
var commandExecute = require('../models/command_executer/command_executer_factory');
var data = require('../models/auth')();
var toClient = require('./send_to_client');

//var oauth = require('./oauth');

var oauth = require('oauthio');

oauth.initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');

exports.redirect = function(result, req,res) {
        console.log("Am in /oauth/redirect");
        console.log(req);
        var cmd;
        if(typeof req.body === undefined) {
            cmd = req.query.cmd;
        } else {
          var cmd = req.body.cmd;
        }
        console.log(cmd);
        console.log(result);
        if (result instanceof Error) {
            res.status(500).send("error: " + result.message);
            return;
        }

        result.me().done(function(me) {
            console.log(me);
            res.status(200).send(JSON.stringify(me));
        });
    };

exports.authProviders = function(req, res) {
  var redir = false;
  var cmd = req.body.command;
  console.log(req.body.command);

  req.session.cmd = cmd;

  console.log('noua comanda este :' + req.session.cmd);

  if (req.session.oauth!=undefined) {
    console.log('sesiune oauth este twitter' + req.session.oauth.twitter);
    console.log('sesiune oauth este facebook' + req.session.oauth.facebook);
    console.log('sesiune oauth este youtube' + req.session.oauth.youtube);
  }
  else {
    console.log('req.session.oauth == undefined');
  }
  switch(cmd.replace(/[ ]/g, '')) {
    case "register": res.render('login/register'); req.session.cmd = '!!!!?!!!!'; return; break;
    case "login": res.render('login/index'); req.session.cmd = '!!!!?!!!!'; return; break;
    case "logout": loginController.logout(req, res); req.session.cmd = '!!!!?!!!!'; return; break;
    default: 
      if(req.session.passport.user === undefined) {
        toClient.send(req, res, 'You must be logged in first');
      }
      var splitedCommand = commandValidator.isValid(cmd); 
      if (splitedCommand) {
        authentication_handler.authenticate(req, res);
      }
      else {
        toClient.send(req, res, '<p>Command format is not valid!</p>')
      }
      console.log('splitedCommand: ' + splitedCommand);
    break;
  }
}

exports.commandInterpret = function(req, res) {
  console.log("Am in commandInterpret" + "\n");
  console.log(req.session.oauth);

  var cmd = req.session.cmd;
  //console.log(req.session.cmd);
  //console.log('************************************\n\n\n' + JSON.stringify(req.session.oauth));
  
  new data.ApiHistory({id: req.session.passport.user, command: cmd})
  .save(null, {method: 'insert'})
  .then(function(model) {
  },function(err) {
    console.log(err);
  });

  commandExecute.execute(req, res);

  req.session.cmd === '!!!!?!!!!'
  return ;
}

replaceSpace = function(cmd) {
  return cmd.replace('%20',' ');
}
