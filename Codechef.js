const scraper = require("./ScrapingEngine");

const CONTEST_TITLE_SELECTOR = "#contest-title1 > p > a";
const CONTEST_DAY_SELECTOR = "#clock-day-left-upcoming";
const CONTEST_HOUR_SELECTOR = "#clock-hrs-left-upcoming";
const CONTEST_MIN_SELECTOR = "#clock-min-left-upcoming";
const CONTEST_SEC_SELECTOR = "#clock-sec-left-upcoming";

getUpcomingContest = async () => {
  const page = await scraper.getNewPage();
  await page.goto("https://www.codechef.com/");
  const { link, contestName } = await page.$eval(
    CONTEST_TITLE_SELECTOR,
    (el) => {
      return { link: el.getAttribute("href"), contestName: el.innerText };
    }
  );
  const days = await page.$eval(CONTEST_DAY_SELECTOR, (el) => el.innerText);
  const hours = await page.$eval(CONTEST_HOUR_SELECTOR, (el) => el.innerText);
  const mins = await page.$eval(CONTEST_MIN_SELECTOR, (el) => el.innerText);
  const secs = await page.$eval(CONTEST_SEC_SELECTOR, (el) => el.innerText);
  return {
    link: link,
    contestName: contestName,
    time: { days: days, hours: hours, mins: mins, secs: secs },
  };
};

module.exports = {
  getUpcomingContest,
};
