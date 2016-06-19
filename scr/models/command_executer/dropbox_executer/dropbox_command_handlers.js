var request = require('request');
var fs = require('fs');

var Promise = require('es6-promise').Promise;

exports.getFile = function(req, res) {
	return new Promise(function(resolve, reject) {
		request('https://api-content.dropbox.com/1/files/auto/' + res, {
			auth: { bearer: req.session.oauth.dropbox.access_token }
		}).pipe(fs.createWriteStream(res));
		resolve(res);
	});
}