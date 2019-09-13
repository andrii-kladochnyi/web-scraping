import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { Pool } from "pg";
import * as utils from "./utils";
import { ISearchData } from "./types";

(async () => {
    
    let auth: OAuth2Client;
    const pool = new Pool({
        user: 'tag_management',
        host: 'localhost',
        database: 'my_database',
        password: 'plaintextpassword',
        port: 5432
    });
    
    try{
        auth = await utils.googleAuth();
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

            searchData = await utils.grabSearchCounts(
                "https://www.google.com/search?q=", 
                "#resultStats", 
                searchData
            );

            console.log("***");
            console.log(searchData);
            
        await utils.saveResults(pool, searchData);
    }

    console.log(">>> END");

})();

