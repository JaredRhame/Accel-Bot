const Discord = require("discord.js");
const newChannel = require("../index.js");
const ChanName = require("../models/chanNames.js");

module.exports.run = async (bot, message, args) => {
  let currentVC = message.member.voiceChannel;
  ChanName.find({ channelName: currentVC.name }, function(err, docs) {
    if (currentVC.name.includes("Stream Channel") && docs[0] == undefined) {
      message.channel.send(
        `${message.member} you need to save a channel name to use this command`
      );
      return;
    }

    docs[0].channelOpen = true;

    if (currentVC.name.includes("Stream Channel") || docs[0] != undefined) {
      currentVC.overwritePermissions(
        message.guild.roles.find(role => role.name === "@everyone"),
        {
          // Allows Everyone to see, join, or speak
          CREATE_INSTANT_INVITE: false,
          VIEW_CHANNEL: true,
          CONNECT: true,
          SPEAK: true
        }
      );
      message.channel.send(`${message.member} your channel has been unlocked.`);
      docs[0].save();
    } else {
      message.channel.send(
        `${message.member} you must be in a Stream Channel to use this command!`
      );
    }
  });
};
module.exports.help = {
  name: "unlock"
};
