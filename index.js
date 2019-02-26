const botconfig = require("./config/botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
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
let count = 0;

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
  let getMoved = newVoice.members;

  dChannel.setUserLimit(1);

  setTimeout(function createChannel() {
    count++;
    // Limits the count to 5 maximum VCs
    if (dChannel.full && count <= 5) {
      newMember.guild
        .createChannel(`StreamChannel ${count}`, "voice")
        // .then(count++)
        .catch(console.error);
      console.log(count);
      bot.on("channelCreate", async channel => {
        // module.exports.channel = { blurb };
        // Creates role once new channel is created
        // newMember.guild
        //   .createRole({
        //     name: "Stream1",
        //     color: "BLUE"
        //   })
        //   .then(role =>
        //     console.log(
        //       `Created new role with name ${role.name} and color ${role.color}`
        //     )
        //   )
        // .catch(console.error);
        if (channel.name.includes("StreamChannel")) {
          channel.overwritePermissions(
            newMember.guild.roles.find(role => role.name === "@everyone"),
            {
              // Disallow Everyone to see, join, invite, or speak
              CREATE_INSTANT_INVITE: false,
              VIEW_CHANNEL: true,
              CONNECT: false,
              SPEAK: true
            }
          );
          // Allows specific role to join the newly created channel
          // channel.overwritePermissions(
          //   newMember.guild.roles.find(role => role.name === "Stream1"),
          //   {
          //     //Explicitely allow the role to see, join and speak
          //     VIEW_CHANNEL: true,
          //     CONNECT: true,
          //     SPEAK: true
          //   }
          // );

          for (let [snowflake, guildMember] of getMoved) {
            let mem = guildMember;
            mem
              .setVoiceChannel(channel)
              .then(() => console.log(`Moved ${newMember.displayName}`))
              .catch(console.error);
            // genChannel.send(
            //   `${channel.name} voice channel has been created by ${
            //     mem.user.username
            //   }`
            // );
          }
        }
      });
    }
  }, 10000);
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

bot.login(botconfig.token);
