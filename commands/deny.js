const Discord = require("discord.js");
const ChanName = require("../models/chanNames.js");

module.exports.run = async (bot, message, args) => {
  let currentVC = message.member.voiceChannel;
  let deniedUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  ChanName.find({ channelName: currentVC.name }, function(err, docs) {
    if (currentVC.name.includes("Stream Channel") || docs[0] != undefined) {
      currentVC.overwritePermissions(deniedUser, {
        // Lets specifc user see, join, or speak locked chan
        CREATE_INSTANT_INVITE: false,
        VIEW_CHANNEL: true,
        CONNECT: false,
        SPEAK: true
      });
      message.channel.send(
        `${deniedUser} you were denied access to ${currentVC.name}`
      );
    } else {
      message.channel.send(
        `${message.member} you must be in a Stream Channel to use this command!`
      );
    }
  });
};
module.exports.help = {
  name: "deny"
};
