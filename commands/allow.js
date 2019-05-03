const Discord = require("discord.js");
const ChanName = require("../models/chanNames.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");

  let currentVC = message.member.voiceChannel;
  let allowedUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  ChanName.find({ channelName: currentVC.name }, function(err, docs) {
    if (currentVC.name.includes("StreamChannel") || docs[0] != undefined) {
      currentVC.overwritePermissions(allowedUser, {
        // Lets specifc user see, join, or speak locked chan
        CREATE_INSTANT_INVITE: false,
        VIEW_CHANNEL: true,
        CONNECT: true,
        SPEAK: true
      });
      message.channel.send(
        `${allowedUser} you were granted access to ${currentVC.name}`
      );
    } else {
      message.channel.send(
        `${message.member} you must be in a Stream Channel to use this command!`
      );
    }
  });
};
module.exports.help = {
  name: "allow"
};
