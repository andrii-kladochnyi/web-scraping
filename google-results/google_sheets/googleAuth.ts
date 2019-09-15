import * as fs from "fs";
import * as readline from "readline";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { Credentials } from "google-auth-library";


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

let readFileAsync = function(path): Promise<Buffer>{
    return new Promise((res, rej) => {
        fs.readFile(path, (err, content) => {
            if(err) return rej(err);
            
            res(content);
        })        
    }); 
};

// Load client secrets from a local file.
/* fs.readFile('./client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content.toString()), listMajors);
}); */

export async function googleAuth(): Promise<OAuth2Client>{
    let credContent = await readFileAsync('client_secret.json');
    let credentials = JSON.parse(credContent.toString());

    const {client_secret, client_id, redirect_uris} = credentials['installed'];
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    let token: Buffer;
    // Check if we have previously stored a token.
    try{
        token = await readFileAsync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
    } catch (error) {
        if(error.code == 'ENOENT'){
            const newCreds = await getNewToken(oAuth2Client);
            oAuth2Client.setCredentials(newCreds);
        } else {
            throw error;
        }
    }
    
    return oAuth2Client;
}

async function getNewToken(oAuth2Client: OAuth2Client): Promise<Credentials> {
    return new Promise((res, rej) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return rej('Error while trying to retrieve access token \n' + err);
                //oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                res(token);
            });
        });
    });

}
