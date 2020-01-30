const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ["--proxy-server=proxy.crawlera.com:8010"]
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", request => {
    console.log("* ", request.resourceType());
    if (request.resourceType() == "image") request.abort();
    else request.continue();
  });
  await page.setExtraHTTPHeaders({
    "Proxy-Authorization":
      "Basic " +
      Buffer.from("506a54bc3ef941f5a57ef5be82f2a332:").toString("base64")
  });

  page.setDefaultNavigationTimeout(120000);

  const version = await page.browser().version();
  console.log("version: ", version);
  console.log("Opening page ...");
  let tstart = new Date();
  let tend;
  try {
    await page.goto("https://www.udemy.com/courses/music/music-software/");
    tend = new Date();
  } catch (err) {
    tend = new Date();
    console.log(err);
  }
  console.log(`>>> ${(tend.getTime() - tstart.getTime()) / 1000} s`);
  console.log("Taking a screenshot ...");
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
  console.log(">>> End");
})();
