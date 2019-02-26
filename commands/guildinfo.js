const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let sIcon = message.guild.iconURL;
  let guildEmbed = new Discord.RichEmbed()
    .setDescription("Guild Information")
    .setColor("#9e7e7e")
    .setThumbnail(sIcon)
    .addField("Guild Name", message.guild.name)
    .addField("Created on: ", message.guild.createdAt)
    .addField("You joined: ", message.member.joinedAt)
    .addField("Total Members: ", message.guild.memberCount);

  return message.channel.send(guildEmbed);
};

module.exports.help = {
  name: "guildinfo"
};
