const config = require('./config');
const request = require("request-promise-native");
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/api/github-stats', async ctx => {
    let ghResponse = await rq("https://api.github.com/repos/facebook/react");
    ctx.body = ghResponse;
});

app.use(router.routes())
    .listen(config.PORT, () => {
        console.log(`Server listening on port: ${config.PORT}`);
    });

const rq = (url) => {
    return request(url, {
        headers: {
            "User-Agent": "AndriyKladochny",
            "Authorization": `token ${config.GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.mercy-preview+json"
        } 
    })
};



