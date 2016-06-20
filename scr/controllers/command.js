var loginController = require('./login');
var commandValidator = require('./validator');
var authentication_handler = require('./detect_providers');
var commandExecute = require('../models/command_executer/command_executer_factory');
var data = require('../models/auth')();
var toClient = require('./send_to_client');
var outputFotmat = require('./format_output');
var help = require('../models/command_executer/help_executer/help_handler');

// 
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


// Function used to identify which route the command shoud take
exports.authProviders = function(req, res) {
  var redir = false;
  var cmd =  req.body.cmd; //command
  console.log('*****' + cmd);

  req.session.cmd = cmd;

  switch(cmd.replace(/[ ]/g, '')) {
    case "register": loginController.registerPost(req, res); req.session.cmd = '!!!!?!!!!'; return; break;
    case "login": loginController.checkLogin(req, res, undefined); req.session.cmd = '!!!!?!!!!'; return; break;
    case "logout": loginController.logout(req, res); req.session.cmd = '!!!!?!!!!'; return; break;

    default: 

      // Help command
      if (cmd.indexOf('help') == 0 ) {
        help.help(req, res, cmd); return;
      }

      // Check if authenticated
      if(req.session.passport.user === undefined) {
        toClient.send(req, res, outputFotmat.errorMessage('You must be logged in first'));
        return;
      }
      var splitedCommand = commandValidator.isValid(cmd); 
      if (splitedCommand) { // if valid, login with providers
        console.log('se face autentificarea');
        authentication_handler.authenticate(req, res);
      }
      else {
        // Database insert
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


// Funcion used to launch the command in execution
exports.commandInterpret = function(req, res) {
  var cmd = req.session.cmd;
  console.log('Sunt in command interpret  ' + req.session.cmd);

  // Database insert
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
