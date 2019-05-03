const Discord = require("discord.js");
const mongoose = require("mongoose");
const ChanName = require("../models/chanNames.js");
const URL = "mongodb://localhost/Settings";
mongoose.connect(
  URL,
  { useNewUrlParser: true },
  function(err) {
    console.log("mongoDB connected", err);
  }
);

module.exports.run = async (bot, message, args) => {
  let sUser = message.author;
  let currentVC = message.member.voiceChannel;

  let newName = args.join(" ");
  // ChanName.findOneAndUpdate(sUser.id, { channelName: newName });

  //creates new chanName obj with the new given name and attaches it to the user
  const chanName = new ChanName({
    _id: mongoose.Types.ObjectId(),
    username: sUser.username,
    userID: sUser.id,
    channelName: newName
  });
  // NEED ERROR HANDLING FOR IF USER IS NOT IN A DYNAMIC CHANNEL. ALSO HAVE A CHECK FOR THAT USER'S ID SO THEY ARE THE ONLY ONE ALLOWED TO CHANGE THE NAME AND MODS

  ChanName.find({ userID: sUser.id }, function(err, docs) {
    // console.log(docs);
    if (docs.length == 1) {
      // console.log(docs.length);
      ChanName.deleteOne(docs[0], function(err) {
        console.log(err);
      });
    }
  });
  // console.log(newName);
  currentVC.setName(newName);

  //Saves the new channel name to the DB
  chanName.save();
  // .then(result => console.log(result))
  // .catch(err => console.log(err));

  message.reply("That name has been saved to the database.");
  return;
};

module.exports.help = {
  name: "setName"
};
