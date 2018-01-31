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

cron.schedule('0 */15 * * * *', function() {
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
                    var allLink = {
                        githubLink: githubLink,
                        twitterLink: twitterLink,
                        discordLink: discordLink,
                        telegram: telegram,
                        reddit: reddit
                    }
                    connection.query('select * from coin_history where coin_id=' + id, function(err, coinData) {
                        if (!err) {
                            console.log('coinData', coinData);

                            getAllData(allLink, function(all) {
                                if (all) {
                                    console.log('all', all);
                                    connection.query("insert into coin_history(coin_id,date_time,twitter_followers,github_totalCommits,reddit_followers,telegram_followers) values(" +
                                        id + ",'" + looper.dateFormat(new Date()) + "', " + all[1].twitterLink + "," + all[3].githubLink + "," + all[0].reddit + "," + all[2].telegram + ")",
                                        function(err, added) {
                                            if (!err) {
                                                // getCommitUpdate(id, githubLink);
                                                // redditUpdate(id, reddit);
                                                // twitterUpdate(id, twitterLink);
                                                // telegramUpdate(id, telegram);
                                                console.log('added new');
                                            } else {
                                                console.log('Error for adding new history', err)
                                            }
                                        })
                                } else {
                                    console.log('Error', err);
                                }
                            })

                            // if (coinData.length > 0) {
                            //     getCommitUpdate(id, githubLink);
                            //     redditUpdate(id, reddit);
                            //     twitterUpdate(id, twitterLink);
                            //     telegramUpdate(id, telegram);
                            // } else {
                            //     connection.query("insert into coin_history(coin_id,date_time) values(" + id + ",'" + looper.dateFormat(new Date()) + "')", function(err, added) {
                            //         if (!err) {
                            //             getCommitUpdate(id, githubLink);
                            //             redditUpdate(id, reddit);
                            //             twitterUpdate(id, twitterLink);
                            //             telegramUpdate(id, telegram);
                            //         } else {
                            //             console.log('Error for adding new history', err)
                            //         }
                            //     })
                            // }
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

function getAllData(allLink, callback) {
    var alldata = [];

    redditUpdate(allLink.reddit, function(reddit) {
        alldata.push({ "reddit": reddit })
        twitterUpdate(allLink.twitterLink, function(twitter) {
            alldata.push({ "twitterLink": twitter })
            telegramUpdate(allLink.telegram, function(telegram) {
                alldata.push({ "telegram": telegram })
                getCommitUpdate(allLink.githubLink, function(githubLink) {
                    alldata.push({ "githubLink": githubLink })
                    console.log('alldata', alldata);
                    callback(alldata)
                })
            })
        })
    })

}

function redditUpdate(redUrl, callback) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.subscribers .number').text();
            callback(followes);

            // connection.query('update coin_history set reddit_followers=' + followes + ' where coin_id=' + id, function(err, insData) {
            //     if (!err) {
            //         console.log('Update reddit');
            //     } else {
            //         console.log('Error', err);
            //     }
            // })
        }
    });
}

// gitUpdate(1, 'https://github.com/AElfProject/AElf');

// function gitUpdate(id, redUrl) {

// }


function twitterUpdate(redUrl, callback) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.ProfileNav-item--followers a').attr('title');
            followes = parseInt(followes.replace(',', ''));
            callback(followes)

            // connection.query('update coin_history set twitter_followers=' + followes + ' where coin_id=' + id, function(err, insData) {
            //     if (!err) {
            //         console.log('Update twitter');
            //     } else {
            //         console.log('Error', err);
            //     }
            // })
        }
    });
}

function telegramUpdate(redUrl, callback) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.tgme_page_extra').text();
            followes = parseInt(followes.replace(/\s/g, ''));
            callback(followes);
            // connection.query('update coin_history set telegram_followers=' + followes + ' where coin_id=' + id, function(err, insData) {
            //     if (!err) {
            //         console.log('Update telegram');
            //     } else {
            //         console.log('Error', err);
            //     }
            // })
        }
    });
}
// facebookUpdate(1, "https://www.facebook.com/aelfio/");

function facebookUpdate(id, link) {}

function getCommitUpdate(repo, callback) {
    var getLinks = request(repo, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var commi = $('.numbers-summary .commits a .text-emphasized').text().trim();
            commi = parseInt(commi);
            callback(commi);

            // console.log('total commit', commi)
            // connection.query('update coin_history set github_totalCommits=' + commi + ' where coin_id=' + id, function(err, insData) {
            //     if (!err) {
            //         console.log('Update github');
            //     } else {
            //         console.log('Error', err);
            //     }
            // })

        }
    });
}


exports.getallData = function(req, res) {
    // connection.query('SELECT * FROM coins c left join coin_history h on c.id=h.coin_id',
    //     function(err, data) {
    //         if (!err) {
    //             console.log('data', data);
    //             res.json({ code: 200, status: 1, message: 'Data get successfully', data: data });
    //             return;
    //         } else {
    //             console.log('Error', err);
    //             res.json({ code: 200, status: 0, message: 'Error for get data' })
    //             return;
    //         }
    //     })

    connection.query('SELECT * FROM coins c left join coin_history h on c.id=h.coin_id ORDER  BY  1 DESC  LIMIT  2',
        function(err, data) {
            if (!err) {
                console.log('data', data);
                var twitter_followers = getPersontage(data[0].twitter_followers, data[1].twitter_followers);
                var github_totalCommits = getPersontage(data[0].github_totalCommits, data[1].github_totalCommits);
                var reddit_followers = getPersontage(data[0].reddit_followers, data[1].reddit_followers);
                var telegram_followers = getPersontage(data[0].telegram_followers, data[1].telegram_followers);
                var allData = [{
                    id: data[1].id,
                    code: data[1].code,
                    date_added: data[1].date_added,
                    twitter: data[1].twitter,
                    discord: data[1].discord,
                    github: data[1].github,
                    facebook: data[1].facebook,
                    telegram: data[1].telegram,
                    reddit: data[1].reddit,
                    slack: data[1].slack,
                    coin_id: data[1].coin_id,
                    date_time: data[1].date_time,
                    twitter_followers: twitter_followers,
                    discord_followers: data[1].discord_followers,
                    github_totalCommits: github_totalCommits,
                    facebook_followers: data[1].facebook_followers,
                    slack_followers: data[1].slack_followers,
                    reddit_followers: reddit_followers,
                    telegram_followers: telegram_followers
                }]
                res.json({ code: 200, status: 1, message: 'Data get successfully', data: allData });
                return;
            } else {
                console.log('Error', err);
                res.json({ code: 200, status: 0, message: 'Error for get data' })
                return;
            }
        })
}



function getPersontage(b, a) {
    var data = Math.abs(((b - a) / (b)) * 100)
    return Math.round(data * 100) / 100;
}