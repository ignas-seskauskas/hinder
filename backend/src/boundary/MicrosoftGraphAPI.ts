import { access } from "fs";
import { EventController } from "../controller/EventController";
import auth from "../auth";
import { json } from "stream/consumers";

export class MicrosoftGraphAPI {
    async GetToken(){
        //const request = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=be911c74-b5ad-40a6-bdb1-914a557380ea&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FauthenticateMicrosoft&response_mode=query&scope=offline_access%20Calendars.ReadWrite&state=12345"
        //const tokenCode = "M.C107_BL2.2.bec9f992-868a-37dd-433a-923202fbe0ed";
        //"https://login.microsoftonline.com/common/oauth2/v2.0/token?client_id=be911c74-b5ad-40a6-bdb1-914a557380ea&scope=scope=offline_access%20Calendars.ReadWrite&code=M.C107_BL2.2.fb6f5194-bf5f-02db-84a3-1cf2a3c55202&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FauthenticateMicrosoft&grant_type=authorization_code&client_secret=_Qt8Q~JsJZjRCtbGkpr6fsePq8Q7xK0RDUAKrbDf",
        const refreshToken = 'M.C107_BL2.-CYSU8MohM80cZuu1I1aBbBGNAr6FeAtFKq0!6pCpbsXLCfnDP*cMgBNq0W9emnjlFXRsgVl!1W8b5MttKfaO0MNeNsY0k0RAfuq3Rz2m6j11qu5fwo7vyfms0gA748lpr0!GoVPt5voJp!9oWyKjo9P9S2swabdJZqIr3QL6driasIVsbCcX93bZzBZXrgP!YYbpVgvnQL8nL0nxH1Gf25MTfgvh1PGjecAMtSLR2EletlNdvvGv!Y90e6VBhkSS9n6hELazUy0FTr9C*aYkgf0GVYn565Qhc0pLLEzso5tB*yr9LQNgTyb84xcaq5yL1od53idDszH311gBFLQRHwEfVsazwxPG1S9qgKwC*P5iydsPuvaCG!DrBi3QCdA4sKJHr1uPhWsICYEoVEIc3rc$';
        var request = require("request");
        return new Promise(function (resolve, reject) {
            request.post(
                'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                { form: { client_id: 'be911c74-b5ad-40a6-bdb1-914a557380ea', scope: 'https://graph.microsoft.com/.default',
                     client_secret: '_Qt8Q~JsJZjRCtbGkpr6fsePq8Q7xK0RDUAKrbDf',  grant_type: 'refresh_token', 
                     refresh_token: refreshToken} },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        console.log(error);
                        reject(error);
                    }
                }
            );
        });
    }

    async getUserEvents(token: string) {
        const tokenObj = JSON.parse(token);
        const options = {
            url: 'https://graph.microsoft.com/v1.0/me/calendar/events',
            headers: {
                'Authorization': 'Bearer ' + tokenObj['access_token']
            }
          };
        var request = require("request");
        return new Promise(function (resolve, reject) {
            request.get(
                options,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                        resolve(body);
                    } else {
                        console.log(error);
                        reject(error);
                    }
                }
            );
        });
    }

    async sendCreateEventRequest(request: any, token:string) {
        const tokenObj = JSON.parse(token);
        const options = {
            url: 'https://graph.microsoft.com/v1.0/me/calendar/events',
            headers: {
                'content-type': "application/json",
                'Authorization': 'Bearer ' + tokenObj['access_token']
            },
            body: request,
            json: true
          };
        var request = require("request");
        // console.log(request.post(
        //     options,
        //     function (error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             console.log(body);
        //             return body;
        //         } else {
        //             console.log(error+body+response);
        //             return error;
        //         }
        //     }
        // ));
        return new Promise(function (resolve, reject) {
            request.post(
            options,
            function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    console.log(body);
                    resolve(body);
                } else {
                    console.log(error+body+response);
                    reject(error);
                }
            }
        );
        });
    }
}