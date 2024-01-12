const give_recognition = require("./actions/giveRecognition");
const home_opened = require("./actions/homeOpened");
const pick_reward = require("./actions/pickReward");
const check_balance = require("./actions/checkBalance");
const claim_award = require("./actions/claimAward");
const recognition_submitted = require("./actions/recognitionSubmit");
const open_leaderboard = require("./actions/openLeaderboard");

module.exports = (app) => {
    give_recognition(app);
    pick_reward(app);
    home_opened(app);
    check_balance(app);
    claim_award(app);
    recognition_submitted(app);
    open_leaderboard(app);
};
