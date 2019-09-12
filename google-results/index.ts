import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { googleAuth, grabSearchCounts } from "./utils";
import { ISearchData } from "./types";

(async () => {
    let auth: OAuth2Client;
    try{
        auth = await googleAuth();
    } catch(error) {
        console.log("Google Auth error");
        console.log(error);
        return;
    }

    const sheets = google.sheets({version: 'v4', auth});
    const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId: '11S7CHAZ4XqLsMu44ymqaHcnYm0gnpZxGbuoBAZNZTfc',
        range: 'Sheet1!A2:C6',
    });

    console.log(sheetData.data.values);
    if(sheetData.data.values.length){
        let searchData: ISearchData = 
                sheetData.data.values.reduce((data: ISearchData, value) => {
                    data[value[1]] = {
                        id: value[0],
                        query: value[2]
                    }
                    return data;
                },{});

        await grabSearchCounts(
            "https://www.google.com/search?q=", 
            "#resultStats", 
            searchData,
            function(el: HTMLElement): string{
                console.log("***");
                debugger;
                let clone: HTMLElement = el.cloneNode(true) as HTMLElement;
                clone.querySelector("nobr").remove();
                return clone.innerText;
            }
        );
    }

    console.log(">>> END");

})();

