const grabStats = require('./utils/grabStats');
const Logger = require('./Logger');
const logger = new Logger('logs', 'stack-', 'json');
let startUrl = 'https://linuxacademy.com/library/';

(async () => {
  const stats = await grabStats(
    startUrl,
    '#AdvSearchResults .search-result-container h3',
    '#AdvSearchPagination .ais-Pagination-item--nextPage a',
    false
  );

  logger.log(JSON.stringify(stats));
})();
