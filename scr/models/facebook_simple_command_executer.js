var facebookCommandHandlers = require('./facebook_command_handlers');
var utils = require('./utils.js');


const facebookPostPhoto = "facebookpostphoto";
const facebookPost = "facebookpost";

exports.singleCommandExecute = function(req, res, cmd, direct) {
	console.log('singleCommandExecute:' + cmd);
	var splitCmd = cmd.split('&&');
	console.log(splitCmd[0].replace(/[ ]/g, '')  + "    " + facebookPostPhoto);

	if (splitCmd[0].replace(/[ ]/g, '') === facebookPost) {
		var result = utils.validHints(['m', 'u'], splitCmd[1]);
		if (result instanceof Error) {
			//afiseaza eroarea la client
			req.session.command_output = 'Bad format :(';
			return res.redirect('/');
		}
		else {
			console.log('result: ' + result);
			facebookCommandHandlers.facebookFeedPostMessage(req, result[0], result[1]).then(function(){
				console.log('Minunat, ai postat pe facebook ceva wow!');
				req.session.command_output = 'Posted on facebook';
				return res.redirect('/');
			})
			.catch(function(){
				req.session.command_output = 'Did not post, there has been an error :(';
				return res.redirect('/');
			});
		}
	}
	if (splitCmd[0].replace(/[ ]/g, '') === facebookPostPhoto) {
		console.log("Punem si noi o poza ");	
		console.log('***');
		console.log('***');
		console.log('***');
		console.log('***');
		var result = utils.validHints(['u', 'm', 'p'], splitCmd[1]);
		console.log(result);
		if (result instanceof Error || (result[0] == undefined && result[2] == undefined)) {
			req.session.command_output = 'Bad format :(';
			return res.redirect('/');
		}
		else if (direct && result[0] != undefined) {
			console.log('result: ' + result);
			facebookCommandHandlers.facebookFeedPostPhoto(req, result[0], result[1]).then(function(){
				console.log('Minunat, ai postat pe facebook o poza  wow!');
				req.session.command_output = 'Photo posted!! :D';
				return res.redirect('/');
			})
			.catch(function(){
				//se transmite mesajj de eroare la client;
				//verifica dimensiunea pozei si tipul ei
				req.session.command_output = 'Can not post on facebook :(';
				return res.redirect('/');
			});
		}
		else if (!direct && result[2] != undefined) {
			console.log("Ar fi bine sa fim aici!" + result[2] + "!");
			facebookCommandHandlers.facebookPostPhotoFromLocal(req, result[1], result[2]).then(function(){
				console.log("Totul e bine dar Nina nu ma lasa in pace!");
				req.session.command_output = 'Posted photo from server local :D';
				return res.redirect('/');
			}).catch(function(){
				req.session.command_output = 'Can not post on facebook :(';
				return res.redirect('/');
			});
		}
		else {
			console.log("MAi gandeste si tu putin");
			//eroare la client
			req.session.command_output = 'Bad format :(';
			return res.redirect('/');
		}
	}
	req.session.command_output = 'Workeeed!';
	return res.redirect('/');
	
}
