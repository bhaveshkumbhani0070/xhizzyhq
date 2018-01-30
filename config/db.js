var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.host, // ,
    user: process.env.user, //,
    password: process.env.password, //,
    database: process.env.database, //
});

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