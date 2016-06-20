var gmailCommandHandlers = require('./gmail_command_handlers');
var toClient = require('../../../controllers/send_to_client');
var outputFormat = require('../../../controllers/format_output');

function send(req, res, obj) {
	var email_lines = [];
    console.log(obj);
    if (obj.c != undefined) {
    	obj.c.replace('\n', '<br/>');
    } else {
    	obj.c ='';
    }
    if (obj.s != undefined) {
    	obj.s.trim();
    } else {
    	obj.s ='';
    }
    if (obj.t != undefined) {
    	obj.t.trim();
    }

    console.log(obj);

    var email_lines = [];
    email_lines.push('To: ' + obj.t);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: ' + obj.s);
    email_lines.push('');
    email_lines.push(obj.c);

    var email = email_lines.join('\r\n').trim();

	gmailCommandHandlers.send(req, res, email).then(function(){
		console.log('Minunat, ai trimis mail!');
		toClient.send(req, res, outputFormat.okMessage('You have sent an email.'));
	})
	.catch(function(error){
		toClient.send(req, res, outputFormat.errorMessage('An error has occurred. ' + error));
	});
}

exports.execute = function(req, res, obj) {
	switch (obj.action) {
		case "send" : send(req, res, obj); break;
		default: 
			toClient.send(req, res, outputFormat.errorMessage('Provider doesn\'t suport this actions'));
		break;
	}
}
