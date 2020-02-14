const puppeteer = require('puppeteer');

async function grabStats(
  url,
  titleSelector,
  nextBtnSelector,
  withTimeout = false
) {
  const browser = await puppeteer.launch({
    //devtools: true
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
  );
  /*
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Ubuntu/10.10 Chromium/12.0.703.0 Chrome/12.0.703.0 Safari/534.24"
  );*/

  await page.goto(url, {
    waitUntil: 'networkidle0'
  });

  /*   await page.waitForSelector('.pagination-container');

  console.log('*** Cookies ***');
  console.log(await page.cookies()); */

  const jobList = await processPage(
    page,
    titleSelector,
    nextBtnSelector,
    withTimeout,
    1
  );

  await browser.close();

  return Object.entries(
    jobList.reduce((obj, job) => {
      const j = job.toLowerCase();
      if (obj[j]) {
        obj[j]++;
      } else {
        obj[j] = 1;
      }
      return obj;
    }, {})
  )
    .sort(([key1, val1], [key2, val2]) => val2 - val1)
    .reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {});
}

async function processPage(
  page,
  titleSelector,
  nextBtnSelector,
  withTimeout,
  pageN
) {
  console.log('>>> Page ', pageN++);

  let newJobs = await page.$$eval(titleSelector, jobTitles =>
    jobTitles.map(el => el.innerText)
  );

  console.log(newJobs);

  const nextPageUrl = await page.evaluate(nextBtnSelector => {
    let nextBtn = document.querySelector(nextBtnSelector);
    if (!nextBtn) {
      return null;
    } else {
      return nextBtn.href;
    }
  }, nextBtnSelector);

  if (nextPageUrl) {
    console.log('>>> nextPageUrl: ', nextPageUrl);
    if (withTimeout) {
      await timeout();
    }
    await page.goto(nextPageUrl);

    /*     await page.waitForSelector('.pagination-container');

    console.log('*** Cookies ***');
    console.log(await page.cookies()); */

    newJobs = [
      ...newJobs,
      ...(await processPage(
        page,
        titleSelector,
        nextBtnSelector,
        withTimeout,
        pageN
      ))
    ];
  } else {
    console.log('>>> LAST PAGE!');
  }

  return newJobs;
}

function timeout() {
  return new Promise(res => {
    const time = Math.floor(Math.random() * 8000) + 2000;
    setTimeout(() => {
      res();
    }, time);
  });
}

module.exports = grabStats;
