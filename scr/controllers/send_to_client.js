exports.send = function(req, res, text) {
	console.log('Send somethig to client!');
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end(text);		
}