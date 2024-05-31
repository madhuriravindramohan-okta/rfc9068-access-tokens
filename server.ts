import * as express from 'express';
import { AuthenticationClient, ManagementClient, ResourceServerCreateTokenDialectEnum } from 'auth0';
import * as console from "node:console";
import 'dotenv/config'
import * as jwt_bearer from 'express-oauth2-jwt-bearer';

const app = express();

app.get('/token-generate', async function (req, res) {
    const management = new ManagementClient({
        domain: `${process.env.DOMAIN}.auth0.com`,
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
    });
    await management.resourceServers.create({
        name: 'api',
        identifier: 'http://api1.com',
        token_dialect: ResourceServerCreateTokenDialectEnum.rfc9068_profile
    }, null);

    await management.clientGrants.create({
        client_id: `${process.env.CLIENT_ID}`,
        audience: 'http://api1.com',
        scope: []
    }, null);

    const authentication = new AuthenticationClient({
        domain: `${process.env.DOMAIN}.auth0.com`,
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
    });

    const tokenSet = await authentication.oauth.clientCredentialsGrant({
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
        audience: 'http://api1.com',
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tokenSet.data));
});

app.listen(30000, function () {
    console.log('Listening on port 30000');
});
