const config = require("../config");
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: config.notionToken,
});

module.exports = notion;
