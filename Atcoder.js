const scraper = require("./ScrapingEngine");

const START_TIME_SELECTOR =
  "#contest-table-upcoming > div > table > tbody tr:nth-child(1) > td:nth-child(1)";
const CONTEST_NAME_SELECTOR =
  "#contest-table-upcoming > div > table > tbody tr:nth-child(1) > td:nth-child(2) > small > a";

getUpcomingContest = async () => {
  const page = await scraper.getNewPage();
  await page.goto("https://atcoder.jp");
  const startTime = await page.$eval(START_TIME_SELECTOR, (el) => el.innerText);
  const { link, contestName } = await page.$eval(
    CONTEST_NAME_SELECTOR,
    (el) => {
      return { link: el.getAttribute("href"), contestName: el.innerText };
    }
  );
  return {
    startTime: startTime,
    link: "https://atcoder.jp" + link,
    contestName: contestName,
  };
};

module.exports = {
  getUpcomingContest,
};
