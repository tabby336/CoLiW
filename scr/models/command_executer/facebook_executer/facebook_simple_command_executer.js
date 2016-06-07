var facebookCommandHandlers = require('./facebook_command_handlers');
var toClient = require('../../../controllers/send_to_client')

function post(req, res, obj) {
	var text = "default text";
	facebookCommandHandlers.facebookFeedPostMessage(req, obj.m, obj.u).then(function(msg){
		console.log('Minunat, ai postat pe facebook ceva wow!');
		toClient.send(req, res, "You have posted on facebook!");
	}).catch(function(err){
		console.log('***a aparut o eroare  ' + req.session.command_output);
		toClient.send(req, res, '<p>An error has occured </p> <p>' + err.error.message + '</p>');
	});
}

function upload(req, res, obj) {
	if (obj.u != undefined) {
		console.log('o noua poza uploadata\n\n\n\n')
		facebookCommandHandlers.facebookFeedPostPhoto(req, obj.u, obj.m).then(function(mes){
			console.log('Minunat, ai postat pe facebook o poza  wow!');
			toClient.send(req, res, 'Photo posted!');
		})
		.catch(function(err){
			console.log(err);
			toClient.send(req, res, '<p>An error has occured </p> <p>' + err.error.message + '</p>');
		});
	}
	else {
		facebookCommandHandlers.facebookPostPhotoFromLocal(req, obj.m, obj.p).then(function(){
			console.log("Totul e bine dar Nina nu ma lasa in pace!");
			toClient.send(req, res, '<p>Photo posted!</p>');
		}).catch(function(){
			toClient.send(req, res, '<p>An error has occured </p> <p>' + err.error.message + '</p>');
		});
	}
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "post" : post(req, res, obj); break;
		case "upload" : upload(req, res, obj); break;
		default: 
			toClient.send(req, res, 'Provider doesn\'t suport this actions');
		break;
	}
}
