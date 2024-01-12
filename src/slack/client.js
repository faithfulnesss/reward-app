const config = require("../config");
const { App } = require("@slack/bolt");
const setupListeners = require("./listeners/index");

const app = new App({
    token: config.slackBotToken,
    signingSecret: config.slackSigningSecret,
    logLevel: "debug",
});

setupListeners(app);

module.exports = app;
