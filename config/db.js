var mysql = require('mysql');

var host = process.env.host;
var user = process.env.user;
var password = process.env.password;
var database = process.env.database;

var connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
});

console.log('******', host, ' ', user, ' ', password, ' ', database);
connection.connect(function(err, connection) {
    if (err) {
        console.log('err', err);
        //connection.release();oken
        // res.json({ "code": 100, "status": "Error in connection database" });
        return;
    }
    console.log('Database connected');

});

module.exports = connection;