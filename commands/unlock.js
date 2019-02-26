const Discord = require("discord.js");
// import { dChannel, genChannel, botChannel } from "index.js";
const newChannel = require("../index.js");

module.exports.run = async (bot, message, args) => {
  // const genChannel = message.guild.channels.find(
  //   chan => chan.name === "general"
  // );
  // const channel = message.guild.channels.find(chan => chan.name === "TEST");
  let currentVC = message.member.voiceChannel;
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
};
module.exports.help = {
  name: "unlock"
};
