var TelegramBot = require('telegrambot');
var app_id = "";
var api_hash = "";
var token = ""

var api = new TelegramBot(token);

// api.invoke('getMe', {}, function(err, me) {
//     if (err) throw err;
//     console.log(me);
// });