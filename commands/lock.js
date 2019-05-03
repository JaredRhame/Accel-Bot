const Discord = require("discord.js");
const ChanName = require("../models/chanNames.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");

  let currentVC = message.member.voiceChannel;
  ChanName.find({ channelName: currentVC.name }, function(err, docs) {
    if (currentVC.name.includes("StreamChannel") || docs[0] != undefined) {
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
    } else {
      message.channel.send(
        `${message.member} you must be in a Stream Channel to use this command!`
      );
    }
  });
};
module.exports.help = {
  name: "lock"
};
