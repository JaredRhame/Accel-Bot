const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");

  let currentVC = message.member.voiceChannel;
  currentVC.overwritePermissions(
    message.guild.roles.find(role => role.name === "@everyone"),
    {
      // Locks Everyone from -> see, join, or speak
      CREATE_INSTANT_INVITE: false,
      VIEW_CHANNEL: true,
      CONNECT: false,
      SPEAK: true
    }
  );
};
module.exports.help = {
  name: "lock"
};
