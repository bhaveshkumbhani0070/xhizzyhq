//const request = require('request-promise');  
var config=require('../config/config.js')

var FBapp_id="FBapp_id";
var FBapp_secret="FBapp_secret";

var FB = require('fb'),
    fb = new FB.Facebook({appId: FBapp_id, appSecret: FBapp_secret});

FB.setAccessToken('');

exports.facebookLikes=function(req,res){
	var pagename=req.params.pagename;
	// loopersoft

	FB.api(pagename,{ fields: ['id', 'name','likes'] }, function (res) {
	  if(!res || res.error) {
	   console.log(!res ? 'error occurred' : res.error);
	   return;
	  }
	  console.log(res);
	});	
}
