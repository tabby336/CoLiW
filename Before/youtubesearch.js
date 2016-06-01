var YouTube = require('youtube-node');
var Twitter = require('twitter');

var youTube = new YouTube();

youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

youTube.search('World War z Trailer', 1, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
   
    var videoId = result.items[0].id.videoId;
    //console.log("http://youtube.com/watch?v=" + videoId

    var url = "http://youtube.com/watch?v=" + videoId;  
    console.log(url);
}

 
var client = new Twitter({
  consumer_key: 'AwuaxZOLJlBYI6AVR6doQIZyW',
  consumer_secret: 'dA7h3WH14tmRbKSLMIqeNjccxTGrtkeBPIRTlgfqLksDK7JU1R',
  access_token_key: '2477427176-tlbvnJ6c7LdduMvjJe6L7YW2MfoI9z9LmBpj7Sr',
  access_token_secret: 'xap8d3Y3vRlOeN7NUN1wIoeuxNlVBfDxzg7tHv5asVGBq'
});

client.post('statuses/update', {status: 'I love #web ' + url},  function(error, tweet, response){
  if(error) throw error;
  console.log(tweet);  // Tweet body. 
  //console.log(response);  // Raw response object. 
});


});
