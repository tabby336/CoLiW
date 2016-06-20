http = require('http');

var Promise = require('es6-promise').Promise;

exports.help = function() {
  var help = '<div>' + 
                  '<p> <b>Jokes commands:<b> </p> <br>' +

                  '<br>' +

                  '&nbsp; jokes <b>get</b> <br>' +
                  '&nbsp;&nbsp;&nbsp; Gets a Chuck Norris joke. <br>' +

                  '<br>' + 

                  '&nbsp; Jokes commands can also be pipped with twitter and facebook post and also gmail. <br>' +

                  '<br><br>'  +

               '</div>';
  return help;
}


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

