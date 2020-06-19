const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login(process.env.token);

const version = "1.0.0";
const guildId = "719559077772001280";

//Helpers functions
class CommandHandler {
  static isValidCommandName(name) {
    for (var l in this)
      if (
        this.hasOwnProperty(l) &&
        this[l] instanceof Function &&
        l === "onMessage_" + name
      )
        return true;
    return false;
  }
  static handle_command(commandName, message, args) {
    if (this.isValidCommandName(commandName)) {
      this[`onMessage_${commandName}`](message, args);
      return true;
    } else return false;
  }
  static onMessage_hello = (message, args) => {
    message.reply("Hello world!");
  };
}

module.exports = CommandHandler;
