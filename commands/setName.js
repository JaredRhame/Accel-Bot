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
  let newName = args.join(" ");

  //creates new chanName obj with the new given name and attaches it to the user
  const chanName = new ChanName({
    _id: mongoose.Types.ObjectId(),
    username: sUser.username,
    userID: sUser.id,
    channelName: newName,
    channelID: channelID
  });

  //error handling for if the newName is an empty string
  // NEED ERROR HANDLING FOR IF USER IS NOT IN A DYNAMIC CHANNEL. ALSO HAVE A CHECK FOR THAT USER'S ID SO THEY ARE THE ONLY ONE ALLOWED TO CHANGE THE NAME AND MODS
  setTimeout(function setName() {
    ChanName.find({ userID: sUser.id }, function(err, docs) {
      //   // console.log(docs);
      //   let nameChange = newName => {
      //     currentVC.setName(newName);
      //   };
      //
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
        //Sets name of current VC
        currentVC.setName(newName);

        //Saves the new channel name to the DB
        chanName.save();
        message.reply("That name has been saved to the database.");
      } else if (
        docs[0].userID == sUser.id &&
        docs[0].channelName == currentVC.name
      ) {
        //Sets name of current VC
        currentVC.setName(newName);

        //Saves the new channel name to the DB
        chanName.save();
        message.reply("That name has been saved to the database.");
      } else {
        message.channel.send(`${sUser} this is not your channel`);
        return;
      }

      if (docs.length == 1) {
        // console.log(docs.length);
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
