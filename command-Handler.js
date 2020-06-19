const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login(process.env.token);

const version = "1.0.0";
const guildId = "694669879273324597";

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
  static onMessage_ping = (message, args) => {
    message.reply("pong!");
  };
  static onMessage_next_round = (message, args) => {
    $.getJSON("https://codeforces.com/api/contest.list", (data) => {
      if (data.status == "OK") {
        data = data.result;
        let next_contest = null;
        let time = Number.MIN_SAFE_INTEGER;
        data
          .filter((element) => element.phase == "BEFORE")
          .forEach((element) => {
            if (element.relativeTimeSeconds > time)
              (next_contest = element), (time = element.relativeTimeSeconds);
          });
        if (next_contest) {
          time = -time;
          let hour = Math.floor(time / (60 * 60));
          time -= hour * 60 * 60;
          let minute = Math.floor(time / 60);
          time -= minute * 60;
          let second = time;
          message.reply(
            `Next contest is ${next_contest.name} and starts in ${hour}:${minute}:${second}`
          );
        } else message.reply("There is no available contests");
      }
    });
  };
  static onMessage_ching = (message, args) => {
    message.reply("chong!");
  };
}

module.exports = CommandHandler;
