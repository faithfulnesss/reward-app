const give_recognition = require("./actions/giveRecognition");
const home_opened = require("./actions/homeOpened");
const pick_reward = require("./actions/pickReward");
const check_balance = require("./actions/checkBalance");
const claim_award = require("./actions/claimAward");
const open_leaderboard = require("./actions/openLeaderboard");
const check_analytics = require("./actions/checkAnalytics");

module.exports = (app) => {
    give_recognition(app);
    pick_reward(app);
    home_opened(app);
    check_balance(app);
    claim_award(app);
    open_leaderboard(app);
    check_analytics(app);
};
