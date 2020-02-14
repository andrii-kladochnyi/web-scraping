const grabStats = require('./utils/grabStats');
const Logger = require('./Logger');
const logger = new Logger('logs', 'stack-', 'json');
let startUrl = 'https://stackoverflow.com/jobs?sort=p';

(async () => {
  const stats = await grabStats(
    startUrl,
    '.listResults .post-tag',
    '.s-pagination--item:last-child:not(.is-selected)',
    false
  );

  logger.log(JSON.stringify(stats));
})();
