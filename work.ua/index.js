const puppeteer = require('puppeteer');
const Logger = require("./Logger");
const logger = new Logger("logs", "json");
let url = "https://www.work.ua/en/jobs-it/?days=122";//"https://www.work.ua/en/jobs-sumy-it/";
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
            jobList.reduce((obj, job) => {
                if(obj[job]){
                    obj[job]++;
                } else {
                    obj[job] = 1;
                }

                return obj;
            }, {})
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