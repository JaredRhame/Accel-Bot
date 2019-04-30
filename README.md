# Accel-Bot

A bot for dynamically creating Discord Voice Channels.

# Requirements

<li>A voice channel named "CREATECHANNEL".
<li>A text channel named "channel-bot-feed".

# Permissions
<li>Manage Channels
<li>Read Text Channels & See Voice Channels
<li>Send Messages

# Description

This bot uses the CREATECHANNEL channel to create a voice channel for the user. If the user does not have a
channel name saved in the DB, a default name is given. Once a custom name has been saved by the user, the 
custom name will be used when the dynamic channel is created again. Every dynamic channel will be removed
once empty.

# Commands
<li> ~help - Shows list of commands and brief description of bot
<li> ~setName - Sets the name of user's specifc channel and saves it to the DB(spaces can be used)
ex: ~setName XL is the best
<li> ~lock - Locks channel from any other user from joining
<li> ~unlock - Unlocks channel and opens it to everyone
<li> ~allow - Allows specific user to join locked channel 
<li> ~deny - Denies specific user from joining locked channel 
<li> ~modDelete - Allows mod to delete name from database
