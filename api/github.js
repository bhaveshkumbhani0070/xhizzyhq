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
                            getAllData(allLink, function(all) {
                                if (all) {
                                    console.log('all', all);
                                    connection.query("insert into coin_history(coin_id,date_time,twitter_followers,github_totalCommits,reddit_followers,telegram_followers,facebook_followers,discord_followers) values(" +
                                        id + ",'" + looper.dateFormat(new Date()) + "', " + all[1].twitterLink + "," +
                                        all[3].githubLink + "," + all[0].reddit + "," + all[2].telegram + "," + all[4].facebook_followers + "," + all[5].discord_followers + " )",
                                        function(err, added) {
                                            if (!err) {
                                                console.log('added new');
                                            } else {
                                                console.log('Error for adding new history', err)
                                            }
                                        })
                                } else {
                                    console.log('Error', err);
                                }
                            })
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
    var resdata = [];
    redditUpdate(allLink.reddit, function(reddit) {
        resdata.push({ "reddit": reddit })
        twitterUpdate(allLink.twitterLink, function(twitter) {
            resdata.push({ "twitterLink": twitter })
            telegramUpdate(allLink.telegram, function(telegram) {
                resdata.push({ "telegram": telegram })
                getCommitUpdate(allLink.githubLink, function(githubLink) {
                    resdata.push({ "githubLink": githubLink })
                    facebookUpdate("https://graph.facebook.com/v2.12/aelfio?fields=fan_count&access_token=EAAC4RyvOjaQBAIzGgwwIZCEkm8r5JRGL9xdf44JRUibNZAK7JibM2ddCVDBtfn3WIYA8kOmzJdiKMoCOHbjj8R7TYjCQB7AgsA9wPLUPCsWo7b66gxZBNoRCf13KHZBJkPotGgEKaKI54RtqyHKfmlrINt5GPiP5APRhYC2YVwZDZD",
                        function(fbData) {
                            if (fbData) {
                                resdata.push({ "facebook_followers": fbData });
                                discordUser(function(disc) {
                                    if (disc) {
                                        resdata.push({ "discord_followers": disc });
                                        console.log('resdata', resdata);
                                        callback(resdata);
                                    }
                                })
                            } else {
                                resdata.push({ "facebook_followers": 0 });
                                console.log('resdata', resdata);
                                callback(resdata);
                            }
                        });
                })
            })
        })
    })

}

function discordUser(callback) {

    const token = "NDA5OTIyNTcyMTEzOTM2Mzg1.DVlp6g.oMcAC91xu4b68EQ06WsfcdFldBg"
    const Discord = require('discord.js');
    const discord = new Discord.Client();

    discord.on('ready', () => {
        var allUser = 0;
        for (user of discord.users) {
            allUser = allUser + 1;
            console.log(); //user[1].username
        }
        callback(allUser)
        console.log('allUser', allUser);
    });
    discord.login(token);
}

function redditUpdate(redUrl, callback) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.subscribers .number').text();
            callback(followes);
        }
    });
}


function twitterUpdate(redUrl, callback) {
    var getLinks = request(redUrl, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var followes = $('.ProfileNav-item--followers a').attr('title');
            followes = parseInt(followes.replace(',', ''));
            callback(followes)
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
        }
    });
}

function facebookUpdate(url, callback) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            callback(body["fan_count"]);
        }
    });
}

function getCommitUpdate(repo, callback) {
    var getLinks = request(repo, function(err, res, body) { //async request
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var commi = $('.numbers-summary .commits a .text-emphasized').text().trim();
            commi = parseInt(commi);
            callback(commi);
        }
    });
}


exports.getallData = function(req, res) {
    connection.query('SELECT * FROM coins c left join coin_history h on c.id=h.coin_id ORDER  BY  date_time DESC  LIMIT  2',
        function(err, data) {
            if (!err) {
                console.log('data', data);
                var twitter_followers = getPersontage(data[0].twitter_followers, data[1].twitter_followers);
                var github_totalCommits = getPersontage(data[0].github_totalCommits, data[1].github_totalCommits);
                var reddit_followers = getPersontage(data[0].reddit_followers, data[1].reddit_followers);
                var telegram_followers = getPersontage(data[0].telegram_followers, data[1].telegram_followers);
                var facebook_followers = getPersontage(data[0].facebook_followers, data[1].facebook_followers);
                var allData = [{
                    id: data[0].id,
                    code: data[0].code,
                    coin_id: data[0].coin_id,
                    date_time: data[0].date_time,
                    github: data[0].github,
                    github_totalCommitsPer: github_totalCommits,
                    github_totalCommits: data[0].github_totalCommits,
                    reddit: data[0].reddit,
                    reddit_followersPer: reddit_followers,
                    reddit_followers: data[0].reddit_followers,
                    twitter: data[0].twitter,
                    twitter_followersPer: twitter_followers,
                    twitter_followers: data[0].twitter_followers,
                    telegram: data[0].telegram,
                    telegram_followersPer: telegram_followers,
                    telegram_followers: data[0].telegram_followers,
                    facebook: data[0].facebook,
                    facebook_followers: data[0].facebook_followers,
                    facebook_followersPer: facebook_followers,
                    slack: data[1].slack,
                    slack_followers: data[0].slack_followers,
                    slack_followersPer: 0,
                    discord: data[0].discord,
                    discord_followers: data[0].discord_followers,
                    discord_followersPer: 0,
                    date_added: data[0].date_added
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