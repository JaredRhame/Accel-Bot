const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");

  let currentVC = message.member.voiceChannel;
  let allowedUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  currentVC.overwritePermissions(allowedUser, {
    // Lets specifc user see, join, or speak locked chan
    CREATE_INSTANT_INVITE: false,
    VIEW_CHANNEL: true,
    CONNECT: true,
    SPEAK: true
  });
  console.log(allowedUser);
};
module.exports.help = {
  name: "allow"
};
