var looper = require('kumbhanialex')
var github = require('octonode');
var client = github.client();
var cron = require('node-cron');
var connection = require('../config/db.js');
var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');

exports.gitcommit = function(req, res) {
    var ghrepo = client.repo('kumbhanialex111/xhizzyhq');
    // ghrepo.commits(function(err, data) {
    //     if (!err) {
    //         var totalCommit = data.length;
    //         var lastCommit = data[0] ? data[0].commit.committer.date : "";
    //         var date1 = new Date(lastCommit);
    //         var diffrentFromlastCommit = looper.diffBetweenDate(date1);
    //         console.log('data', diffrentFromlastCommit);
    //         console.log('totalCommit', totalCommit);
    //         // for (var i = 0; i < data.length; i++) {
    //         // }
    //     } else {
    //         console.log('Error', err);
    //     }
    // });
}

cron.schedule('0 */5 * * * *', function() {
    start()
});


function start() {
    connection.query('select * from coins', function(err, data) {
        if (!err) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    console.log('data', data[i])
                    var id = data[i].id;
                    var githubLink = data[i].github;
                    var twitterLink = data[i].twitter;
                    var discordLink = data[i].discord;
                    var facebook = data[i].facebook;
                    var telegram = data[i].telegram;
                    var reddit = data[i].reddit;

                    // githubLink = githubLink.split('/');
                    // var repo = githubLink[githubLink.length - 2] + '/' + githubLink[githubLink.length - 1]

                    connection.query('select * from coin_history where coin_id=' + id, function(err, coinData) {
                        if (!err) {
                            console.log('coinData', coinData);
                            if (coinData.length > 0) {
                                getCommitUpdate(id, githubLink);
                                redditUpdate(id, reddit);
                                twitterUpdate(1, twitterLink);

                            } else {
                                connection.query("insert into coin_history(coin_id,date_time) values(" + id + ",'" + looper.dateFormat(new Date()) + "')", function(err, added) {
                                    if (!err) {
                                        getCommitUpdate(id, githubLink);
                                        redditUpdate(id, reddit);
                                        twitterUpdate(1, twitterLink);
                                    } else {
                                        console.log('Error for adding new history', err)
                                    }
                                })
                            }
                        } else {
                            console.log('Error', err);
                        }
                    })
                }
            } else {
                console.log('There is no any data');
            }
        } else {
            console.log('Error', err);
        }
    })
}

function redditUpdate(id, redUrl) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.subscribers .number').text();
            connection.query('update coin_history set reddit_followers=' + followes + ' where coin_id=' + id, function(err, insData) {
                if (!err) {
                    console.log('Update reddit');
                } else {
                    console.log('Error', err);
                }
            })
        }
    });
}

// gitUpdate(1, 'https://github.com/AElfProject/AElf');

// function gitUpdate(id, redUrl) {

// }


function twitterUpdate(id, redUrl) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.ProfileNav-item--followers a').attr('title');
            followes = parseInt(followes.replace(',', ''));

            connection.query('update coin_history set twitter_followers=' + followes + ' where coin_id=' + id, function(err, insData) {
                if (!err) {
                    console.log('Update twitter');
                } else {
                    console.log('Error', err);
                }
            })
        }
    });
}

// facebookUpdate(1, "https://www.facebook.com/aelfio/");

function facebookUpdate(id, link) {}

function getCommitUpdate(id, repo) {
    var getLinks = request(repo, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var commi = $('.numbers-summary .commits a .text-emphasized').text().trim();
            commi = parseInt(commi);
            console.log('total commit', commi)
            connection.query('update coin_history set github_totalCommits=' + commi + ' where coin_id=' + id, function(err, insData) {
                if (!err) {
                    console.log('Update github');
                } else {
                    console.log('Error', err);
                }
            })

        }
    });
    // var ghrepo = client.repo(repo);
    // ghrepo.commits(function(err, data) {
    //     if (!err) {
    //         var totalCommit = data.length;
    //         var lastCommit = data[0] ? data[0].commit.committer.date : "";
    //         var date1 = new Date();
    //         var date2 = new Date(lastCommit);
    //         console.log('totalCommit', totalCommit);

    //     } else {
    //         console.log('Error', err);
    //     }
    // });
}



// function getCommitAdd(id, repo) {
//     var ghrepo = client.repo(repo);
//     ghrepo.commits(function(err, data) {
//         if (!err) {
//             var totalCommit = data.length;
//             var lastCommit = data[0] ? data[0].commit.committer.date : "";
//             var date1 = new Date();
//             var date2 = new Date(lastCommit);
//             console.log('totalCommit', totalCommit);

//             var allData = {
//                 coin_id: id,
//                 date_time: new Date(),
//                 github_totalCommits: totalCommit
//             }
//             connection.query("insert into coin_history(coin_id,date_time,github_totalCommits) values (" + id + ",'" + looper.dateFormat(new Date()) + "'," + totalCommit + ")", function(err, insData) {
//                 if (!err) {
//                     console.log('Added');
//                 } else {
//                     console.log('Error', err);
//                 }
//             })

//         } else {
//             console.log('Error', err);
//         }
//     });
// }


exports.getallData = function(req, res) {
    connection.query('SELECT * FROM coins c left join coin_history h on c.id=h.coin_id',
        function(err, data) {
            if (!err) {
                console.log('data', data);
                res.json({ code: 200, status: 1, message: 'Data get successfully', data: data });
                return;
            } else {
                console.log('Error', err);
                res.json({ code: 200, status: 0, message: 'Error for get data' })
                return;
            }
        })
}