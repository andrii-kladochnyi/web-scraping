const grabStats = require("./grabStats");
const Logger = require("./Logger");
const logger = new Logger("logs", "github-", "json");
let startUrl = "https://jobs.github.com/positions";

(async () => {
    const stats = await grabStats(
                    startUrl, 
                    ".positionlist .title h4", 
                    ".pagination a[rel=next]",
                    false
                );

    logger.log(JSON.stringify(stats));
})();