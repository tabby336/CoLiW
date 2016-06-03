var twitterCommandFactory = require('../twitter_simple_command_executer');
var facebookCommandSimpleExecuter = require('../facebook_simple_command_executer');
var twitterDoubleCommandFactory = require('../twitter_double_command_executer');
var dropboxDoubleCommandExecuter = require('../dropbox_double_command_executer');
var youtubeDoubleCommandExecuter = require('../youtube_double_command_executer');
var youtubeCommandSimpleExecuter = require('../youtube_simple_command_executer');

const twitterSearch = "twittersearch";
const facebookPost = "facebookpost";
const twetterRetweet = "twetterretweet";
const twetterFollow = "twetterfollow";


function parseSingleCommand(req, res, cmd) {
  console.log('parseSingleCommand  '  + cmd);
  if (cmd[0].substring(0, 7) === 'twitter') {
    twitterCommandFactory.singleCommandExecute(req, res, cmd[0]);
    return ;
  }
  if (cmd[0].substring(0, 8) === 'facebook') {
    console.log("Facebook command !!!");
    facebookCommandSimpleExecuter.singleCommandExecute(req, res, cmd[0], true);
    return ;
  }
  if (cmd[0].substring(0, 7) === 'youtube') {
    console.log("YOUtube command");
    youtubeCommandSimpleExecuter.singleCommandExecute(req, res, cmd[0]);
    return ;
  }
  if (cmd[0].substring(0, 7) === 'dropbox') {
    console.log("dropbox command");
    return ;
    //trimite la client dropbox nu va permite decat comenzi inlantuite
  }

  res.redirect('/');
}

function parseDoubleCommand(req, res, cmd) {
  console.log("parseDoubleCommand " + cmd[0].substring(0, 7));
  if (cmd[0].substring(0, 7) === 'twitter') {
    twitterDoubleCommandFactory.doubleCommandExecute(req, res, cmd);
  }
  if (cmd[0].substring(0, 8) === 'facebook') {
    console.log("Facebook command");
  }
  if (cmd[0].substring(0, 7) === 'youtube') {
    console.log("Youtube command");
    youtubeDoubleCommandExecuter.doubleCommandExecute(req, res, cmd);
  }
  if (cmd[0].substring(0, 7) === 'dropbox') {
    console.log("dropbox command");
    dropboxDoubleCommandExecuter.doubleCommandExecute(req, res, cmd);
  }

  res.redirect('/');
}

exports.parse = function(req, resp, cmd) {
	var res = cmd.split("|"); 	

 	console.log('RES: ' + res);
  console.log('RES length: ' + res.length);
    if (res.length === 1) {
      console.log("Am o singura comanda");
      parseSingleCommand(req, resp, res);
      return ;
    }
    else if (res.length === 2) {
      parseDoubleCommand(req, resp, res);
      return ;
  	}
  	else {
    	console.log("Your command is too complex and is not suported yet");
      return res.redirect('/');
      //trimite la client un mesaj 
  	}  
    return res.redirect('/');
}

