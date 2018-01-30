var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');

exports.reddit = function(req, res) {
    getUrls("http://www.reddit.com/users/");
    // https://www.reddit.com/r/aelfofficial/
    function getUrls(redUrl) {
        var titles = [];
        var urls = [];
        var links = [];

        var getLinks = request(redUrl, function(err, res, body) { //async request
            if (!err && res.statusCode == 200) {
                var $ = cheerio.load(body);
                $('.titlerow').each(function() {
                    var data = $(this);
                    var title = data.children().eq(0).text();
                    var user = data.next().text();
                    var link = data.next().attr('href');
                    console.log(link);
                })
                getUrls($('.next-button a').attr('href'));
            }
        });
    }
}

// var secret = "";
// var client = "";

// var r = require("nraw");
// var Reddit = new r("Testbot v0.0.1 by Mobilpadde");

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



// scrape reddit, return array containing html links