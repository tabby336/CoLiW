  x.getJoke(req, res, undefined, undefined).then(function(response) {
    console.log(response);
  }).catch(function(error){
    console.log(error);
  });