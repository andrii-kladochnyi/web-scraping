const puppeteer = require('puppeteer');
const Logger = require("./Logger");
const logger = new Logger("logs", "json");
let url = "https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-sumy-it/";
let jobList = [];
let pageN = 1;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    jobList = await processPage(page);

    await browser.close();

    //logger.log(jobList.reduce((str, job) => `${str}${job}\n`, ""));

    logger.log(
        JSON.stringify(
            Object.entries(
                jobList.reduce((obj, job) => {
                    const j = job.toLowerCase();
                    if(obj[j]){
                        obj[j]++;
                    } else {
                        obj[j] = 1;
                    }
                    return obj;
                }, {})
            )
            .sort(([key1, val1], [key2, val2]) => val2-val1)
            .reduce((obj, [key, val]) => {obj[key] = val; return obj}, {})
        )
    );
})();


async function processPage(page){
    console.log(">>> Page ", pageN++);
    let newJobs = await page.$$eval(
                        '#pjax-job-list h2 a', 
                        jobTitles => jobTitles.map(el => el.innerText)
                    );
    
    console.log(newJobs);

    const nextPageUrl = await page.evaluate(() => {
        let nextBtn = 
            document.querySelector(".pagination:first-child li:last-child");
        if(nextBtn.classList.contains("disabled")){
            return null;
        } else {
            return nextBtn.querySelector('a').href;
        }
    });

    if(nextPageUrl){
        await page.goto(nextPageUrl);
        newJobs = [...newJobs, ...await processPage(page)];
    } else {
        console.log(">>> LAST PAGE!");
    }
    
    return newJobs;
}