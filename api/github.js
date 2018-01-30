var looper = require('kumbhanialex')
var github = require('octonode');
var client = github.client();
var cron = require('node-cron');
var connection = require('../config/db.js');

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

    connection.query('select * from coins', function(err, data) {
        if (!err) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    console.log('data', data[i])
                    var id = data[i].id;
                    var link = data[i].github;
                    link = link.split('/');
                    var repo = link[link.length - 2] + '/' + link[link.length - 1]

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
});




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

            // var diffrentFromlastCommit = Math.abs(date1 - date2) / (60 * 60 * 1000); //looper.diffBetweenDate(date1);
            // console.log('data', diffrentFromlastCommit);
            // date2 = looper.dateFormat(date2)
            // connection.query('update git set lastcommit="' + diffrentFromlastCommit + '", totalCommit=' + totalCommit + ', lastcommitDate="' + date2 + '" where id=' + id, function(err, up) {
            //     if (!err) {
            //         console.log('updated');
            //     } else {
            //         console.log('Error for update', err);
            //     }
            // })
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

            // var diffrentFromlastCommit = Math.abs(date1 - date2) / (60 * 60 * 1000); //looper.diffBetweenDate(date1);
            // console.log('data', diffrentFromlastCommit);
            // date2 = looper.dateFormat(date2)
            // connection.query('update git set lastcommit="' + diffrentFromlastCommit + '", totalCommit=' + totalCommit + ', lastcommitDate="' + date2 + '" where id=' + id, function(err, up) {
            //     if (!err) {
            //         console.log('updated');
            //     } else {
            //         console.log('Error for update', err);
            //     }
            // })
        } else {
            console.log('Error', err);
        }
    });
}