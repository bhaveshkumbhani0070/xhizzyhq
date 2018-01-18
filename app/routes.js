var facebook = require('../api/facebook.js');
var twitter = require('../api/twitter.js');
var github = require('../api/github.js');
var telegram = require('../api/telegram.js');
var discord = require('../api/discord.js');

module.exports = function(app) {
    app.get('/api/facebookLikes/:pagename', facebook.facebookLikes);
    app.get('/api/twitter/:accountName', twitter.accountName)
    app.get('/api/github', github.gitcommit);
    app.get('/api/discord', discord.discord);
}