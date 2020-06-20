const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const atcoder = require("./Atcoder");

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
    .addField("!ching", "A command 34an 5atr zula")
    .addField(
      "!next_round",
      "Bot tells you the next round, start time and contest link"
    )
    .addField(
      "!stalk <handle>",
      "A command returns last 5 submission of the user"
    )
    .addField(
      "!stalk <handle> <count>",
      "A command returns last <count> submission of the user"
    );
};

getFormatedTime = (time) => {
  let hour = Math.floor(time / (60 * 60));
  time -= hour * 60 * 60;
  let minute = Math.floor(time / 60);
  time -= minute * 60;
  let second = time;
  return { hour: hour, minute: minute, second: second };
};

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

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
  static onMessage_next_round = async (message, args) => {
    if (args.length > 1) return message.reply("Invalid arguments");
    if (args.length == 0) {
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
            time = getFormatedTime(-time);
            message.reply(
              `Next contest is ${next_contest.name} , starts in ${time.hour}:${time.minute}:${time.second}, https://codeforces.com/contests/${next_contest.id}`
            );
          } else message.reply("There is no available contests");
        }
      });
    } else {
      if (args[0] == "atcoder") {
        const contest = await atcoder.getUpcomingContest();
        message.reply(
          `Next contest is ${contest.contestName} , starts in ${contest.startTime}, ${contest.link}`
        );
      } else message.reply(`invalid online judge`);
    }
  };
  static onMessage_stalk = (message, args) => {
    if (args.length != 1 && args.length != 2)
      return message.reply("invalid arguments");
    let count = 5;
    if (args.length == 2) {
      count = parseInt(args[1]);
      if (count == NaN) return message.reply("Please enter a number");
      if (count > 20) return message.reply("3aiz tmwtny ya islam :(");
    }
    $.getJSON(
      `https://codeforces.com/api/user.status?handle=${args[0]}&from=1&count=${count}`,
      (data) => {
        if (data.status == "OK") {
          data = data.result;
          let embed = new Discord.MessageEmbed().setTitle(args[0]);
          let counter = 0;
          data.forEach((submission) => {
            counter++;
            embed = embed.addField(
              "Problem name",
              submission.problem.name,
              true
            );
            embed = embed.addField("Verdict", submission.verdict, true);
            embed = embed.addField(
              "Time",
              timeConverter(submission.creationTimeSeconds),
              true
            );
            if (counter == 8) {
              message.reply(embed);
              counter = 0;
              embed = new Discord.MessageEmbed().setTitle(args[0]);
            }
          });
          if (counter > 0) message.reply(embed);
        } else message.reply("Error!");
      }
    );
  };
}

module.exports = CommandHandler;
