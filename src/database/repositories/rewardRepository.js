const Reward = require("../models/Reward");
// const RewardRequest = require("../models/RewardRequest");

const getReward = async (filter) => {
    try {
        const reward = await Reward.findOne(filter || {});
        return reward;
    } catch (error) {
        console.error(error);
    }
};

const getRewards = async (filter) => {
    try {
        const rewards = await Reward.find(filter || { isDeleted: false });
        return rewards;
    } catch (error) {
        console.error(error);
    }
};

const deleteReward = async (rewardId) => {
    try {
        const reward = await Reward.deleteOne({ _id: rewardId });
        return reward;
    } catch (error) {
        console.error(error);
    }
};

const softDeleteReward = async (rewardId) => {
    try {
        const reward = await Reward.findOneAndUpdate(
            { _id: rewardId },
            { isDeleted: true }
        );
        return reward;
    } catch (error) {
        console.error(error);
    }
};

const createReward = async (reward) => {
    try {
        const createdReward = await Reward.create(reward);
        return createdReward;
    } catch (error) {
        console.error(error);
    }
};

const updateReward = async (rewardId, update) => {
    try {
        const reward = await Reward.findOneAndUpdate(
            { _id: rewardId },
            { ...update }
        );
        return reward;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getReward,
    getRewards,
    createReward,
    deleteReward,
    updateReward,
    softDeleteReward,
};
