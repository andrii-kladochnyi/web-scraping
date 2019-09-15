import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";

export async function getDataFromSheet(params: {
    auth: OAuth2Client,
    spreadsheetId: string,
    range: string
}){
    const { auth, spreadsheetId, range } = params;

    const sheets = google.sheets({version: 'v4', auth});
    const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
    });

    return sheetData;
}