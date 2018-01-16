var facebook = require('../api/facebook.js');
var twitter = require('../api/twitter.js');
var telegram = require('../api/telegram.js');


module.exports = function(app) {
	    app.get('/api/facebookLikes/:pagename', facebook.facebookLikes);
	    app.get('/api/twitter/:accountName',twitter.accountName)
}