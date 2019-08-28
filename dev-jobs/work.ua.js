const grabStats = require("./grabStats");
const Logger = require("./Logger");
const logger = new Logger("logs", "work.ua-","json");
let startUrl = "https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-sumy-it/";

(async () => {
    const stats = await grabStats(
                    startUrl, 
                    "#pjax-job-list h2 a", 
                    ".pagination:first-child li:last-child a",
                    false
                );

    logger.log(JSON.stringify(stats));
})();