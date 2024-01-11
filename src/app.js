const config = require("./config");
const connectDB = require("./database/connect");
const app = require("./slack/client");
const schedule = require("./utils/scheduler");

connectDB();

(async () => {
  await app.start(config.port);
  await schedule(app);
})();
