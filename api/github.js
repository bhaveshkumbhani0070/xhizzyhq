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
    ghrepo.commits(function(err, data) {
        if (!err) {
            var totalCommit = data.length;
            var lastCommit = data[0] ? data[0].commit.committer.date : "";

            var date1 = new Date(lastCommit);
            var diffrentFromlastCommit = looper.diffBetweenDate(date1);
            console.log('data', diffrentFromlastCommit);
            console.log('totalCommit', totalCommit);
            // for (var i = 0; i < data.length; i++) {
            // }
        } else {
            console.log('Error', err);
        }
    });
}

cron.schedule('0 */1 * * * *', function() {
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

                    githubLink = githubLink.split('/');
                    var repo = githubLink[githubLink.length - 2] + '/' + githubLink[githubLink.length - 1]

                    connection.query('select * from coin_history where coin_id=' + id, function(err, coinData) {
                        if (!err) {
                            console.log('coinData', coinData);

                            if (coinData && coinData.length > 0) {
                                if (coinData[0].github_totalCommits) {
                                    console.log('Alredy count');
                                } else {
                                    getCommitUpdate(id, repo);
                                }
                            } else {
                                getCommitAdd(id, repo);
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

function getUrlsUpdate(id, redUrl) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            console.log('find', $('.subscribers .number').text());
        }
    });
}


function getCommitAdd(id, repo) {
    var ghrepo = client.repo(repo);
    ghrepo.commits(function(err, data) {
        if (!err) {
            var totalCommit = data.length;
            var lastCommit = data[0] ? data[0].commit.committer.date : "";
            var date1 = new Date();
            var date2 = new Date(lastCommit);
            console.log('totalCommit', totalCommit);

            var allData = {
                coin_id: id,
                date_time: new Date(),
                github_totalCommits: totalCommit
            }
            connection.query("insert into coin_history(coin_id,date_time,github_totalCommits) values (" + id + ",'" + looper.dateFormat(new Date()) + "'," + totalCommit + ")", function(err, insData) {
                if (!err) {
                    console.log('Added');
                } else {
                    console.log('Error', err);
                }
            })

        } else {
            console.log('Error', err);
        }
    });
}

function getCommitUpdate(id, repo) {
    var ghrepo = client.repo(repo);
    ghrepo.commits(function(err, data) {
        if (!err) {
            var totalCommit = data.length;
            var lastCommit = data[0] ? data[0].commit.committer.date : "";
            var date1 = new Date();
            var date2 = new Date(lastCommit);
            console.log('totalCommit', totalCommit);

            connection.query('update coin_history set github_totalCommits=' + totalCommit + ' where coin_id=' + id, function(err, insData) {
                if (!err) {
                    console.log('Update');
                } else {
                    console.log('Error', err);
                }
            })
        } else {
            console.log('Error', err);
        }
    });
}