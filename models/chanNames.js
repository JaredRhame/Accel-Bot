const mongoose = require("mongoose");

const chanNameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  userID: String,
  channelName: String,
  channelID: String,
  channelLocked: Boolean,
  allowedUsers: [String],
  deniedUsers: [String]
});

module.exports = mongoose.model("ChanNames", chanNameSchema);

//channelLocked: boolean
//allowedUsers: [String]
//deniedUsers: [String]
