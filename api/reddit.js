exports.reddit = function(req, res) {

}
var secret = "";
var client = "";

var r = require("nraw");
var Reddit = new r("Testbot v0.0.1 by Mobilpadde");

// Reddit.user("Mobilpadde").exec(function(data) {
//     console.log('data', data.data.children);
// })

// Reddit.user("Mobilpadde", function(data) {
//     // Some super awesome code
//     console.log('data', data.data.children.length);
// })

// Reddit.user("Mobilpadde").sort("top").limit(500).exec(function(data) {
//     // Some super awesome code
//     console.log('data', data.data.children.length);
// })

// Reddit.login("kumbhanibhavesh", "alex9099414492").user().liked().limit(7).exec(function(data) {
//     // Some super awesome code
//     console.log('data', data);
// })