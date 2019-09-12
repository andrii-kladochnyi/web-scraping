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
        //await page.screenshot({path: `./temp/${key}.png`});
        //await page.pdf({path: `./temp/${key}.pdf`, format: 'A4'});
        let dataElHtml = await page.$eval(
                        dataSelector,
                        el => {

                            return el.innerHTML;
                            /* if(typeof process == "function"){
                                elText = process(el);
                            } else {
                                elText = (el as HTMLElement).innerText
                            }
                            return parseInt(elText.match(/\d+/g).join(''), 10); */
                        }
                    ); 

        let dataEl = new HTMLElement();
        dataEl.innerHTML = dataElHtml;
        dataEl.querySelector("nobr").remove();
        let count = parseInt(dataEl.innerText.match(/\d+/g).join(''), 10);
        searchData[key].count = count;
        console.log(`${key} : ${count}`);
    }

    await browser.close();

    return searchData;
}