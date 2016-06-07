var facebookCommandHandlers = require('./facebook_command_handlers');

function post(req, res, obj) {
	facebookCommandHandlers.facebookFeedPostMessage(req, obj.m, obj.u).then(function(msg){
		console.log('Minunat, ai postat pe facebook ceva wow!');
		req.session.command_output = 'Posted on facebook';
		return res.redirect('/');
	}).catch(function(err){
		console.log('***a aparut o eroare  ' + req.session.command_output);
		req.session.command_output = 'Did not post, there has been an error :(';
		return res.redirect('/');
	});
}

function upload(req, res, obj) {
	if (obj.u != undefined) {
		console.log('o noua poza uploadata\n\n\n\n')
		facebookCommandHandlers.facebookFeedPostPhoto(req, obj.u, obj.m).then(function(){
			console.log('Minunat, ai postat pe facebook o poza  wow!');
			req.session.command_output = 'Photo posted!! :D';
			return res.redirect('/');
		})
		.catch(function(){
			req.session.command_output = 'Can not post on facebook :(';
			return res.redirect('/');
		});
	}
	else {
		facebookCommandHandlers.facebookPostPhotoFromLocal(req, obj.m, obj.p).then(function(){
			console.log("Totul e bine dar Nina nu ma lasa in pace!");
			req.session.command_output = 'Posted photo from server local :D';
			return res.redirect('/');
		}).catch(function(){
			req.session.command_output = 'Can not post on facebook :(';
			return res.redirect('/');
		});
	}
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "post" : post(req, res, obj); break;
		case "upload" : upload(req, res, obj); break;
		default: 
			req.session.command_output = 'The command action is not defined!' 
			res.redirect('/');
		break;
	}
}
