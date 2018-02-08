var social = require('../api/social.js');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile('index.html', { 'root': "view" });
    });
    app.get('/api/social', social.gitcommit);
}