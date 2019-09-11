import { google } from "googleapis";
import googleAuth from "./googleAuth";
import { OAuth2Client } from "googleapis-common";

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
        range: 'Sheet1!A1:B6',
    });

    console.log(sheetData.data.values);

})();

