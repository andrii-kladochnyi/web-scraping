import { OAuth2Client } from "googleapis-common";
import { Pool } from "pg";
import { grabSearchCounts } from "./scraping";
import { ISearchData } from "./types";
import { saveResults } from "./db";
import { googleAuth, getDataFromSheet, processSheetData } from "./google_sheets";

(async () => {
    
    let auth: OAuth2Client;
    const pool = new Pool({
        user: 'admin',
        host: 'localhost',
        database: 'google_results',
        password: 'plaintextpassword',
        port: 5432
    });
    
    try{
        auth = await googleAuth();
    } catch(error) {
        console.log("Google Auth error");
        console.log(error);
        return;
    }

    const sheetData = await getDataFromSheet({
        auth, 
        range: 'Sheet1!A2:C6', 
        spreadsheetId: '11S7CHAZ4XqLsMu44ymqaHcnYm0gnpZxGbuoBAZNZTfc'
    })

    console.log(sheetData.data.values);
    if(sheetData.data.values.length){
        let searchData: ISearchData = processSheetData(sheetData.data.values);

            searchData = await grabSearchCounts(
                "https://www.google.com/search?q=", 
                "#resultStats", 
                searchData
            );

            console.log("***");
            console.log(searchData);
            
        await saveResults(pool, searchData);
    }

    console.log(">>> END");

})();

