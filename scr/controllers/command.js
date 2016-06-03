
var loginController = require('./login');
var commandValidator = require('./validator');
var detectProviders = require('./detect_providers');
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

function x(req, res, cmd) {
  var providersNeeded = detectProviders.getInvalidProvider(cmd);

    console.log(providersNeeded[0]);
    for(count = 0; count < providersNeeded.length; ++count) {
      console.log(providersNeeded[count]);

      if(!req.session.hasOwnProperty('oauth')) {
        redir = true;
        console.log("Caca no auth session.");
        //nu exista in sesiune oauth => nu e logat
        res.redirect('/signin?cmd=' + cmd + '&&provider=' + providersNeeded[count]);
      } else {
        // exista sesiune de oauth dar nu e logat
        if(!req.session.oauth.hasOwnProperty(providersNeeded[count])) {
          redir = true;
          console.log("Not loginged in with" + providersNeeded[count]);
          
          // la linia asta zice ca can not set headers
          res.redirect('/signin?cmd=' + cmd + '&&provider=' + providersNeeded[count]);
        } else {
          redir = false;
          // este sesiune + e logat
          console.log("Already logged in with " + providersNeeded[count]);  
        }
      }
    }

    console.log("inainte de redirect");
    if(redir == false) {
      res.redirect('/command?cmd=' + cmd);
    }
}

exports.authProviders = function(req, res) {
  var redir = false;
  var cmd = req.body.cmd;

  if (req.session.cmd === undefined || req.session.cmd === '!!!!?!!!!') {
    req.session.cmd = cmd;
  }

  console.log('noua comanda este :' + cmd);


  if(req.session.passport.user === undefined) {
    req.session.command_output = 'Must be logged in first! :D';
    return res.render('login/index');
  }

  switch(cmd.replace(/[ ]/g, '')) {
    case "\"" : console.log("Suunt prea tare!!!"); return; break;
    case "register": res.render('login/register'); return; break;
    case "login": res.render('login/index'); return; break;
    case "logout": loginController.logout(req, res); return; break;
    default: 
      var splitedCommand = commandValidator.isValid(cmd); 
      console.log('splitedCommand: ' + splitedCommand);
    break;
  }
}

exports.commandInterpret = function(req, res) {
  console.log("Am in commandInterpret" + "\n");
  //console.log(req.session);
  var cmd = req.session.cmd;
  console.log(req.session.cmd);
  req.session.cmd = "!!!!?!!!!";
  
  new data.ApiHistory({id: req.session.passport.user, command: cmd})
  .save(null, {method: 'insert'})
  .then(function(model) {
    //res.send(cmd);
    commandSplit.parse(req, res, cmd);
  },function(err) {
    console.log(err);
  });
  
  return ;
}

replaceSpace = function(cmd) {
  return cmd.replace('%20',' ');
}
