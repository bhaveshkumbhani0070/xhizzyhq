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
                    var user = data[i].user;
                    var repo = data[i].repo;
                    var re = user + '/' + repo;
                    getCommit(re);
                }
            } else {

                console.log('There is no any data');
            }
        } else {
            console.log('Error', err);
        }
    })
});

function getCommit(repo) {
    var ghrepo = client.repo(repo);
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