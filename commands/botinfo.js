const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let bIcon = bot.user.displayAvatarURL;

  let botEmbed = {
    embed: {
      title: "Trifuno Bot Information",
      description: "DESCRIPTION",
      color: 7275548,
      footer: {
        icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        text: "Unconcerned LLC"
      },
      thumbnail: {
        url: bIcon
      },
      image: {
        url:
          "https://pbs.twimg.com/profile_images/1070902989026582529/qopPz7AX_400x400.jpg"
      },
      author: {
        name: "Zinoh",
        url: "https://discordapp.com",
        icon_url: "https://cdn.discordapp.com/embed/avatars/4.png"
      },
      fields: [
        {
          name: "~setName",
          value:
            "sets name of your channel, will be used the next time your channel is opened."
        },
        {
          name: "~lock",
          value: "Removes access for all users in server."
        },
        {
          name: "~unlock",
          value: "Allows access for all users in server."
        },
        {
          name: "~deny",
          value: "Denies specific user from joining channel."
        },
        {
          name: "~allow",
          value: "Allows specific user access when channel is locked."
        },
        {
          name: "~help",
          value: "Summons a Kazoo."
        }
      ]
    }
  };
  return message.channel.send(botEmbed);
};

module.exports.help = {
  name: "help"
};
