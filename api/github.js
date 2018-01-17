exports.discord = function(req, res) {
    const token = ""
    const Discord = require('discord.js');
    const discord = new Discord.Client();

    discord.on('ready', () => {
        console.log('I am ready!');
        const guildID = "";
        var memberCount = discord.guilds.array();
        console.log("There are " + memberCount + " people in this server!")
    });

    discord.on('message', message => {
        if (message.content === 'ping') {
            message.reply('pong');
        }
    });
    discord.login(token);


    // console.log(message.mentions.members.first())
}
exports.gitcommit = function(req, res) {
    var github = require('octonode');
    var client = github.client();
    var ghrepo = client.repo('kumbhanialex111/xhizzyhq');
    ghrepo.commits(function(err, data) {
        if (!err) {
            var totalCommit = data.length;
            console.log('totalCommit', totalCommit);
            for (var i = 0; i < data.length; i++) {
                // console.log('data', data[i]);
            }
        } else {
            console.log('Error', err);
        }
    });
}