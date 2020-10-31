const Discord = require("discord.js");
const mongoose = require("mongoose");
const ChanName = require("../models/chanNames.js");
const botconfig = require("../config/botconfig.json");
const ENV = require("dotenv");
ENV.config();

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true },
  function(err) {
    console.log("mongoDB connected", err);
  }
);

module.exports.run = async (bot, message, args) => {
  let sUser = message.author;
  let currentVC = message.member.voiceChannel;
  let channelID = currentVC.id;
  let newName = args.join(" ").replace(/^\s+|\s+$/g, "");

  //creates new chanName obj with the new given name and attaches it to the user
  const chanName = new ChanName({
    _id: mongoose.Types.ObjectId(),
    username: sUser.username,
    userID: sUser.id,
    channelName: newName,
    channelID: channelID
  });

  setTimeout(function setName() {
    ChanName.find({ userID: sUser.id }, function(err, docs) {
      if (newName == "") {
        message.channel.send(
          `${message.member} channel name can not be blank.`
        );
        return;
      }
      // Denies user from changing channel name to createchannel
      if (newName.toUpperCase() == "CREATECHANNEL") {
        message.channel.send(
          `${message.member} that channel name is not allowed.`
        );
        return;
      }
      //First time saving name
      if (docs[0] == undefined) {
        currentVC.overwritePermissions(
          message.guild.roles.find(role => role.name === "@everyone"),
          {
            // Unlocks Everyone from -> join
            CREATE_INSTANT_INVITE: true,
            VIEW_CHANNEL: true,
            CONNECT: true,
            SPEAK: true
          }
        );

        currentVC.setName(newName);

        //Saves the new channel name to the DB
        chanName.save();
        message.reply("That name has been saved to the database.");
      } else if (
        //Second time saving name
        docs[0].userID == sUser.id &&
        docs[0].channelName == currentVC.name
      ) {
        currentVC.setName(newName);

        chanName.save();
        message.reply("That name has been saved to the database.");
      } else {
        message.channel.send(`${sUser} this is not your channel`);
        return;
      }

      if (docs.length == 1) {
        ChanName.deleteOne(docs[0], function(err) {
          console.log(err);
        });
      }
    });
  }, 3000);
};

module.exports.help = {
  name: "setName"
};
