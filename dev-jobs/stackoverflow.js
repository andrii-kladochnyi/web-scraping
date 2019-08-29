const grabStats = require("./utils/grabStats");
const Logger = require("./Logger");
const logger = new Logger("logs", "stack-", "json");
let startUrl = "https://stackoverflow.com/jobs?sort=p";

(async () => {
    const stats = await grabStats(
                    startUrl, 
                    ".listResults .post-tag", 
                    "a.prev-next.test-pagination-next",
                    true
                );

    logger.log(JSON.stringify(stats));
})();