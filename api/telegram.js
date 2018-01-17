var TelegramBot = require('telegrambot');
var api = new TelegramBot('<YOUR TOKEN HERE>');

// api.getUpdates({ offset: 0 }, function(err, updates) {
//     // array of message updates since last poll
//     console.log(updates);
// });

// api.sendMessage({ chat_id: 0, text: 'test' }, function(err, message) {
//     // the chat_id is the id received in the getUpdates() call
// });