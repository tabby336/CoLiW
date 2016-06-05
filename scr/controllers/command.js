
var loginController = require('./login');
var commandValidator = require('./validator');
var authentication_handler = require('./detect_providers');
var facebookCommandHandlers = require('../models/facebook_command_handlers');
var twitterCommandHandlers = require('../models/twitter_command_handlers');
var dropboxCommandHandlers = require('../models/dropbox_command_handlers');
var commandSplit = require('../models/command_parse/command_split');
var data = require('../models/auth')();

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
  var cmd = req.body.cmd;

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
        req.session.command_output = 'Must be logged in first! :D';
        return res.render('login/index');
      }
      var splitedCommand = commandValidator.isValid(cmd); 
      if (splitedCommand) {
       // console.log("111111       RES este *********** ");
        //console.log(res.route);
        authentication_handler.authenticate(req, res);
        res.redirect('/command');
      }
      console.log('splitedCommand: ' + splitedCommand);
    break;
  }
}

exports.commandInterpret = function(req, res) {
  console.log("Am in commandInterpret" + "\n");
  console.log(req.session.oauth);

  var cmd = req.session.cmd;
  console.log(req.session.cmd);
  
  new data.ApiHistory({id: req.session.passport.user, command: cmd})
  .save(null, {method: 'insert'})
  .then(function(model) {
    //res.send(cmd);
   // commandSplit.parse(req, res, cmd);
  },function(err) {
    console.log(err);
  });
  
  return ;
}

replaceSpace = function(cmd) {
  return cmd.replace('%20',' ');
}
