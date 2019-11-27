const grabStats = require("./utils/grabStats");
const Logger = require("./Logger");
const logger = new Logger("logs", "udemy-", "json");
let startUrl = "https://www.udemy.com/courses/music/music-software/";

(async () => {
  const stats = await grabStats(
    startUrl,
    "[class^=curriculum-course-card--container] [data-purpose='search-course-card-title'] h4",
    ".pagination li:last-child:not(.disabled) a",
    true
  );

  logger.log(JSON.stringify(stats));
})();
