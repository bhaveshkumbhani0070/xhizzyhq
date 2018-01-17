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