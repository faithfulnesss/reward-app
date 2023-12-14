const config = require("./config");
const connectDB = require("./database/connect");
const app = require("./slack/client");

connectDB();

(async () => {
  await app.start(config.port);
})();
