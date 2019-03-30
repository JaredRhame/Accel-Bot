const Discord = require("discord.js");
const mongoose = require("mongoose");
const ChanName = require("../models/chanNames.js");
mongoose.connect("mongodb://localhost/Settings");

module.exports.run = async (bot, message, args) => {
  let sUser = message.author;
  let currentVC = message.member.voiceChannel;

  let newName = args.join(" ");

  // console.log(newName);
  currentVC.setName(newName);
  //creates new chanName obj with the new given name and attaches it to the user
  const chanName = new ChanName({
    _id: mongoose.Types.ObjectId(),
    username: sUser.username,
    userID: sUser.id,
    channelName: newName
  });
  //Saves the new channel name to the DB
  chanName.save();
  // .then(result => console.log(result))
  // .catch(err => console.log(err));

  // Set a new channel name
  // .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
  // .catch(console.error);

  //if same user changes name again have the first entry deleted and replaced with the new one.

  // *******************************************************************************
  // ChanName.count({ userID: sUser.id }, function(err, count) {
  //   if (count == 1) {
  //     //document exists });
  //     currentVC.setName(newName);
  //     console.log(count);
  //   } else {
  //   }
  // });
  // ********************************************************************************

  message.reply("That name has been saved to the database.");
  return;
};

module.exports.help = {
  name: "setName"
};
