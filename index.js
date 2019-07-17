const botconfig = require("./config/botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
const ChanName = require("./models/chanNames.js");
const ENV = require("dotenv");
ENV.config();

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);

  bot.user.setActivity("Chunky milk", { type: "Eating" });
});
process.on("unhandledRejection", error =>
  console.error("Uncaught Promise Rejection", error)
);

bot.on("voiceStateUpdate", async (oldMember, newMember) => {
  const dChannel = newMember.guild.channels.find(
    chan => chan.name === "CREATECHANNEL"
  );
  const genChannel = newMember.guild.channels.find(
    chan => chan.name === "general"
  );
  const botChannel = newMember.guild.channels.find(
    chan => chan.name === "channel-bot-feed"
  );

  let oldVoice = oldMember.voiceChannel;
  let newVoice = newMember.voiceChannel;
  let defaultChan = newMember.guild.channels.find(
    chan => chan.name === `StreamChannel (${newMember.displayName})`
  );
  let category = newMember.guild.channels.find(
    group => group.name == "Voice Channels" && group.type == "category"
  );

  function moveMember(channel) {
    // if (!category) console.log("chan cat doesn't exist");
    if (newVoice.name === dChannel.name) {
      for (let [snowflake, guildMember] of newVoice.members) {
        let mem = guildMember;
        // console.log(newVoice.members);
        //REWORK

        mem
          .setVoiceChannel(channel)
          .then(() => console.log(`Moved ${newMember.displayName}`))
          .catch(console.error);
      }
    } else {
      console.log("SHOULD NOT SHOW");
    }
  }

  dChannel.setUserLimit(1);
  if (oldVoice == undefined && newVoice !== dChannel) return;

  setTimeout(function createChannel() {
    ChanName.find({ userID: newMember.id }, function(err, docs) {
      if (newVoice == undefined) return;

      if (newVoice.name === dChannel.name && docs.length < 1) {
        let defaultExists = newMember.guild.channels.find(
          chan => chan.name === `Stream Channel(${newMember.displayName})`
        );
        if (defaultExists) {
          moveMember(defaultExists);
          return;
        }
        newMember.guild
          .createChannel(`Stream Channel(${newMember.displayName})`, "voice")
          .then(channel => {
            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
          })
          .catch(console.error);
        bot.on("channelCreate", async channel => {
          bot.removeAllListeners("channelCreate");

          // channel.overwritePermissions(
          //   channel.guild.roles.find(role => role.name === "@everyone"),
          //
          //   {
          //     // Locks Everyone from joining
          //     CREATE_INSTANT_INVITE: false,
          //     VIEW_CHANNEL: true,
          //     CONNECT: false,
          //     SPEAK: true
          //   }
          // );

          moveMember(channel);
        });

        botChannel.send(
          `Hey, ${newMember} please use the setName command to create name for the channel.`
        );
      } else if (newVoice.name === dChannel.name && docs.length > 0) {
        let channelExists = newMember.guild.channels.find(
          chan => chan.name === `${docs[0].channelName}`
        );
        if (channelExists) {
          moveMember(channelExists);
          return;
        }
        newMember.guild
          .createChannel(`${docs[0].channelName}`, "voice")
          .then(channel => {
            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
          })
          .catch(console.error);

        bot.on("channelCreate", async channel => {
          bot.removeAllListeners("channelCreate");
          moveMember(channel);
        });
      }
    });
  }, 5000);

  if (oldVoice == undefined) return;
  //Checks if a dynamic channel is empty. Auto deletes if it is.

  if (oldVoice.name.includes("Stream Channel") && oldVoice.members.size < 1) {
    oldVoice
      .delete()
      .then(deleted => botChannel.send("Making room for new channels"));
  }

  ChanName.find({ channelName: oldVoice.name }, function(err, docs) {
    //add logic for if the channel doesn't change (default)
    // need handling for if a user joins without being in a voice channel

    if (docs[0] == undefined) return;

    if (oldVoice.members == undefined) return;

    if (docs[0].channelName == oldVoice.name && oldVoice.members.size < 1) {
      oldVoice
        .delete()
        .then(deleted => botChannel.send("Making room for new channels"));
    }
  });
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandFile = bot.commands.get(cmd.slice(prefix.length));
  if (commandFile) commandFile.run(bot, message, args);
});

bot.login(process.env.CLIENT_TOKEN);
