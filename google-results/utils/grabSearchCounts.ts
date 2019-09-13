import * as puppeteer from "puppeteer";
import { ISearchData } from "./../types";

export async function grabSearchCounts(
    url: string,
    dataSelector: string, 
    searchData: ISearchData,
    processDataElem?: (HTMLElement) => string
): Promise<ISearchData> {

    const browser = await puppeteer.launch({
        defaultViewport: {
            deviceScaleFactor: 1,
            width: 1920,
            height: 1080
        },
        args:['--lang=en-US,en']
    });

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US'
    });

    // Set the language forcefully on javascript
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "language", {
            get: function() {
                return ["en-US"];
            }
        });
        Object.defineProperty(navigator, "languages", {
            get: function() {
                return ["en-US", "en"];
            }
        });
    });

    for(const key in searchData){
        let pageUrl = `${url}${searchData[key].query}`;
        await page.goto(pageUrl);
        await page.screenshot({path: `./temp/${key}.png`});
        //await page.pdf({path: `./temp/${key}.pdf`, format: 'A4'});
        let count = await page.$eval(
                        dataSelector,
                        el => {
                            let elCopy = <HTMLElement>el.cloneNode(true);
                            elCopy.querySelector('nobr').remove();
                            return parseInt(elCopy.innerHTML.match(/\d+/g).join(''), 10);
                        }
                    ); 

        searchData[key].count = count;
        console.log(`${key} : ${count}`); 
    }

    await browser.close();

    return searchData;
}