http = require('http');

var Promise = require('es6-promise').Promise;

exports.getJoke = function(req, res, firstName, lastName) {
  var options = {
    host: 'api.icndb.com', //'yesno.wtf',
    path: '/jokes/random'
  };
  if (firstName != undefined && lastName != undefined) {
    options.path = options.path + '?firstName=' + firstName + '&lastName=' + lastName;
  }
  return new Promise(function(resolve, reject) {
    http.request(options, function(response){
        var str = '';
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
          var jsonResponse = JSON.parse(str);
          if (jsonResponse.type == 'success') {
            resolve(jsonResponse.value.joke);
          }
          else {
            reject('');
          }
        });
    }).end();
  });
}

