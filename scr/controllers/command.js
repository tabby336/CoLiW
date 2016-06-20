var loginController = require('./login');
var commandValidator = require('./validator');
var authentication_handler = require('./detect_providers');
var commandExecute = require('../models/command_executer/command_executer_factory');
var data = require('../models/auth')();
var toClient = require('./send_to_client');
var outputFotmat = require('./format_output');
var x = require('../models/command_executer/gmail_executer/gmail_simple_command_executer');


var dropboxController = require('../models/command_executer/dropbox_executer/dropbox_command_handlers');

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
  var cmd =  req.body.cmd; //command
  console.log('*****' + cmd);

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
    case "register": loginController.registerPost(req, res); req.session.cmd = '!!!!?!!!!'; return; break;
    case "login": loginController.checkLogin(req, res, undefined); req.session.cmd = '!!!!?!!!!'; return; break;
    case "logout": loginController.logout(req, res); req.session.cmd = '!!!!?!!!!'; return; break;
    case 'dropbox': dropboxController.getFile(req,res); return; break;

    default: 
    console.log(req.session.passport);
      if(req.session.passport.user === undefined) {
        toClient.send(req, res, outputFotmat.errorMessage('You must be logged in first'));
        return;
      }
      var splitedCommand = commandValidator.isValid(cmd); 
      if (splitedCommand) {
        console.log('se face autentificarea');
        authentication_handler.authenticate(req, res);
      }
      else {

        new data.ApiHistory({id: req.session.passport.user, command: cmd})
        .save(null, {method: 'insert'})
        .then(function(model) {
        },function(err) {
          console.log(err);
        });
        
        toClient.send(req, res, outputFotmat.errorMessage('Command format is not valid!'));
      }
      console.log('splitedCommand: ' + splitedCommand);
    break;
  }
}

exports.commandInterpret = function(req, res) {
  console.log("Am in commandInterpret" + "\n");
  //console.log(req.session.oauth);

  var cmd = req.session.cmd;
  console.log('Sunt in command interpret  ' + req.session.cmd);
  //console.log('************************************\n\n\n' + JSON.stringify(req.session.oauth));
  
  new data.ApiHistory({id: req.session.passport.user, command: cmd})
  .save(null, {method: 'insert'})
  .then(function(model) {
  },function(err) {
    console.log(err);
  });

  console.log('***Voi executa comanda');
  commandExecute.execute(req, res);

  req.session.cmd === '!!!!?!!!!'
  return ;
} 
