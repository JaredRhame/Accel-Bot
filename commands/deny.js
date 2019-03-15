const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");

  let currentVC = message.member.voiceChannel;
  let deniedUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (currentVC.name.includes("StreamChannel")) {
    currentVC.overwritePermissions(deniedUser, {
      // Lets specifc user see, join, or speak locked chan
      CREATE_INSTANT_INVITE: false,
      VIEW_CHANNEL: true,
      CONNECT: false,
      SPEAK: true
    });
    message.channel.send(
      `${deniedUser} you were denied access to this voice channel`
    );
  } else {
    message.channel.send(
      `${message.member} you must be in a Stream Channel to use this command!`
    );
  }
};
module.exports.help = {
  name: "deny"
};
