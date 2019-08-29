const grabStats = require("./utils/grabStats");
const processTitles = require('./utils/processTitles');
const categories = require('./categories');
const Logger = require("./Logger");
const logger = new Logger("logs", "work.ua-","json");
const pLogger = new Logger("logs", "work.ua-p-","json");
let startUrl = "https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-sumy-it/";

(async () => {
    const stats = await grabStats(
                    startUrl, 
                    "#pjax-job-list h2 a", 
                    ".pagination:first-child li:last-child a",
                    false
                );

    logger.log(JSON.stringify(stats));

    const processedStats = processTitles(categories, stats);

    pLogger.log(JSON.stringify(processedStats));
})();