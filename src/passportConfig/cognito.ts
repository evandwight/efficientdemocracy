import CognitoExpress from 'cognito-express';
import { Strategy } from 'passport-oauth2';
import util from 'util';
import db from '../db/databaseApi';
import { UserId } from '../db/types';
import { assertEnv } from "../routes/utils";
import * as C from '../constant';

assertEnv('COGNITO_BASE_URL');
assertEnv('COGNITO_APP_CLIENT_ID');
assertEnv('COGNITO_APP_CLIENT_SECRET');
assertEnv('COGNITO_APP_CLIENT_CALLBACK_URL');
assertEnv('COGNITO_USER_POOL_ID');

//Initializing CognitoExpress constructor
export function createCognitoStrategy() {
    // TODO switch tokenUse to id as access lets you write to cognito
    const cognitoExpress = new CognitoExpress({
        region: "us-east-1",
        cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "access", //Possible Values: access | id
        tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
    });

    const validateAccessToken: (string) => Promise<{ sub: UserId }>
        = util.promisify((accessToken, done) => cognitoExpress.validate(accessToken, done));

    const validate = async (accessToken, refreshToken, profile) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const response = await validateAccessToken(accessToken);
        const cognitoId = response.sub;
        const user = await db.users.getUserByCognitoId(cognitoId);
        let id;
        if (user === null) {
            id = await db.users.createCognitoUser({ cognitoId });
            await db.users.setSetting(id, C.USER.COLUMNS.is_mini_mod, true);
        } else {
            id = user.id;
        }

        return { id };
    }

    return new Strategy({
        authorizationURL: `${process.env.COGNITO_BASE_URL}/login`,
        tokenURL: `${process.env.COGNITO_BASE_URL}/oauth2/token`,
        clientID: process.env.COGNITO_APP_CLIENT_ID,
        clientSecret: process.env.COGNITO_APP_CLIENT_SECRET,
        callbackURL: process.env.COGNITO_APP_CLIENT_CALLBACK_URL,
    }, util.callbackify(validate));
}
