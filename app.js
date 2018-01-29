var express = require('express');
var app = express(); // create our app w/ express
var port = process.env.port || 3000; // set the port

var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
// app.use("/js", express.static(__dirname + '/app/js'));
// app.use("/css", express.static(__dirname + '/app/css'));
// app.use("/fonts", express.static(__dirname + '/app/fonts'));
// app.use("/images", express.static(__dirname + '/app/images'));
// app.use("/public", express.static(__dirname + '/public'));
// app.use("/node_module", express.static(__dirname + '/node_modules'));

require('./app/routes.js')(app);


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);