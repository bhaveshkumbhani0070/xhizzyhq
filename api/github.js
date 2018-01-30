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
    connection.query('select * from git', function(err, data) {
        if (!err) {
            if (data.length > 0) {
                console.log('data', data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].lastcommit == null || !data[i].lastcommit) {
                        var user = data[i].user;
                        var repo = data[i].repo;
                        var re = user + '/' + repo;
                        getCommit(data[i].id, re);
                    } else {
                        console.log('There is alredy lastcommit');
                    }

                }
            } else {

                console.log('There is no any data');
            }
        } else {
            console.log('Error', err);
        }
    })
});

function getCommit(id, repo) {
    var ghrepo = client.repo(repo);
    ghrepo.commits(function(err, data) {
        if (!err) {
            var totalCommit = data.length;
            var lastCommit = data[0] ? data[0].commit.committer.date : "";
            var date1 = new Date();
            var date2 = new Date(lastCommit);
            var diffrentFromlastCommit = Math.abs(date1 - date2) / (60 * 60 * 1000); //looper.diffBetweenDate(date1);
            console.log('data', diffrentFromlastCommit);
            console.log('totalCommit', totalCommit);
            date2 = looper.dateFormat(date2)
            connection.query('update git set lastcommit="' + diffrentFromlastCommit + '", totalCommit=' + totalCommit + ', lastcommitDate="' + date2 + '" where id=' + id, function(err, up) {
                if (!err) {
                    console.log('updated');
                } else {
                    console.log('Error for update', err);
                }
            })
        } else {
            console.log('Error', err);
        }
    });
}