const Discord = require("discord.js");
const ChanName = require("../models/chanNames.js");

module.exports.run = async (bot, message, args) => {
  let currentVC = message.member.voiceChannel;
  let allowedUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );

  if (allowedUser == null || allowedUser == undefined) {
    message.channel.send(
      `${message.member} you need to provide a username to use this command`
    );
    return;
  }

  ChanName.find({ channelName: currentVC.name }, function(err, docs) {
    if (currentVC.name.includes("Stream Channel") && docs[0] == undefined) {
      message.channel.send(
        `${message.member} you need to save a channel name to use this command`
      );
      return;
    }

    let isDenied = docs[0].deniedUsers.indexOf(allowedUser.user.id);
    let isAllowed = docs[0].allowedUsers.indexOf(allowedUser.user.id);

    if (isDenied == -1 && isAllowed == -1) {
      docs[0].allowedUsers.push(allowedUser.user.id);
    } else if (isDenied > -1 && isAllowed == -1) {
      docs[0].deniedUsers.splice(isDenied, 1);
      docs[0].allowedUsers.push(allowedUser.user.id);
    } else {
      message.channel.send(
        `This user has already been granted access to ${currentVC.name}`
      );
      return;
    }

    if (docs[0] != undefined) {
      currentVC.overwritePermissions(allowedUser.user.id, {
        // Lets specifc user see, join, or speak locked chan
        CREATE_INSTANT_INVITE: false,
        VIEW_CHANNEL: true,
        CONNECT: true,
        SPEAK: true
      });
      message.channel.send(
        `${allowedUser} you were granted access to ${currentVC.name.replace(
          /^\s+|\s+$/g,
          ""
        )}`
      );
      docs[0].save();
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
