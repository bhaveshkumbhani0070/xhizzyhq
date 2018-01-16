var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'consumer_key',
  consumer_secret: 'consumer_secret',
  access_token_key: 'access_token_key',
  access_token_secret: 'access_token_secret'
});
 
 exports.accountName=function(req,res){
 	var screen_name=req.params.accountName;
 	//nodejs
	var params = {screen_name: screen_name,count: 1};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	var post=tweets[0].text
	  	var followers=tweets[0].user.followers_count;
	  	console.log(post)
	    console.log(followers);
	  }
	  else{
	  	console.log('Error',error)
	  }
	}); 	
 }


