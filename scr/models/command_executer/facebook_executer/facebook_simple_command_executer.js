var facebookCommandHandlers = require('./facebook_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

function post(req, res, obj) {
	var text = "default text";
	facebookCommandHandlers.facebookFeedPostMessage(req, obj.m, obj.u).then(function(msg){
		console.log('Minunat, ai postat pe facebook ceva wow!');
		toClient.send(req, res, outputFormat.okMessage("You have posted on facebook!"));
	}).catch(function(err){
		console.log('***a aparut o eroare  ' + req.session.command_output);
		toClient.send(req, res, outputFormat.errorMessage('An error has occured. ' + err.error.message));
	});
}

function upload(req, res, obj) {
	if (obj.u != undefined) {
		console.log('o noua poza uploadata\n\n\n\n');
		facebookCommandHandlers.facebookFeedPostPhoto(req, obj.u, obj.m).then(function(mes){
			console.log('Minunat, ai postat pe facebook o poza  wow!');
			toClient.send(req, res, outputFormat.okMessage('Photo posted!'));
		})
		.catch(function(err){
			console.log(err);
			toClient.send(req, res, outputFormat.okMessage('An error has occured. ' + err.error.message));
		});
	}
	else {
		facebookCommandHandlers.facebookPostPhotoFromLocal(req, obj.m, obj.p).then(function(){
			console.log("Totul e bine dar Nina nu ma lasa in pace!");
			toClient.send(req, res, outputFormat.okMessage('Photo posted!'));
		}).catch(function(){
			toClient.send(req, res, outputFormat.errorMessage('An error has occured. ' + err.error.message));
		});
	}
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "post" : post(req, res, obj); break;
		case "upload" : upload(req, res, obj); break;
		default: 
			toClient.send(req, res, outputFormat.errorMessage('Provider doesn\'t suport this actions'));
		break;
	}
}
