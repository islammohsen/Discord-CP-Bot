const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const Discord = require("discord.js");
const { data } = require("jquery");
const bot = new Discord.Client();
bot.login(process.env.token);

const version = "1.0.0";

//Helpers functions
getHelpEmbed = () => {
  return new Discord.MessageEmbed()
    .setTitle("Commands")
    .addField("!ping", "A command just for testing")
    .addField("!chong", "A command 34an 5atr zula")
    .addField(
      "!next_round",
      "Bot tells you the next round, start time and contest link"
    );
};

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
  static onMessage_ping = (message, args) => {
    message.reply("pong!");
  };
  static onMessage_ching = (message, args) => {
    message.reply("chong!");
  };
  static onMessage_help = (message, args) => {
    message.reply(getHelpEmbed());
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
            `Next contest is ${next_contest.name} , starts in ${hour}:${minute}:${second}, https://codeforces.com/contests/${next_contest.id}`
          );
        } else message.reply("There is no available contests");
      }
    });
  };
  static onMessage_stalk = (message, args) => {
    if (args.length != 1) return message.reply("invalid arguments");
    $.getJSON(
      `https://codeforces.com/api/user.status?handle=${args[0]}n&from=1&count=5`,
      (data) => {
        if (data.status == "OK") {
          data = data.result;
          let embed = new Discord().MessageEmbed().setTitle(args[0]);
          data.forEach((submission) => {
            embed = embed.addField("Problem name", submission.problem.name);
            embed = embed.addField("Verdict", submission.verdict, true);
          });
          message.reply(embed);
        } else message.reply("Error!");
      }
    );
  };
}

module.exports = CommandHandler;
