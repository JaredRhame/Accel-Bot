const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let newName = args[0];

  const genChannel = message.guild.channels.find(
    chan => chan.name === "general"
  );
  const channel = message.guild.channels.find(chan => chan.name === "TEST");

  const chanId = channel.id;
  //^^Always going to be false. Need to store the last newName and reference that when making a change

  channel.setName(newName);

  let newNameEmbed = new Discord.RichEmbed()
    .setDescription("~New Channel Alert~")
    .setColor("#e56b00")
    .addField("Channel name has been changed to: ", newName);

  genChannel.send(newNameEmbed);
  return;
};

module.exports.help = {
  name: "changename"
};
