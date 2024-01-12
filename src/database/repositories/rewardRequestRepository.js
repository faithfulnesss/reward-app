const RewardRequest = require("../models/RewardRequest");
const rewardRepository = require("./rewardRepository");
const employeeRepository = require("./employeeRepository");

const createRewardRequest = async (employeeId, rewardId) => {
    try {
        const reward = await rewardRepository.getReward({ _id: rewardId });
        const employee = await employeeRepository.getEmployee({
            SlackID: employeeId,
        });

        await employeeRepository.updateEmployee(
            { _id: employee._id },
            {
                Balance: employee.Balance - reward.Points,
            }
        );

        const createdRewardRequest = await RewardRequest.create({
            Employee: employee._id,
            Reward: reward._id,
        });
        return createdRewardRequest;
    } catch (error) {
        console.error(error);
    }
};

const getRewardRequests = async (filter) => {
    try {
        const rewardRequests = await RewardRequest.find(filter || {});
        return rewardRequests;
    } catch (error) {
        console.error(error);
    }
};

const getRewardRequest = async (filter) => {
    try {
        const rewardRequest = await RewardRequest.findOne(filter || {});
        return rewardRequest;
    } catch (error) {
        console.error(error);
    }
};

const updateRewardRequest = async (rewardRequestId, update) => {
    try {
        const updatedRewardRequest = await RewardRequest.findByIdAndUpdate(
            rewardRequestId,
            update
        );
        return updatedRewardRequest;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getRewardRequests,
    getRewardRequest,
    createRewardRequest,
    updateRewardRequest,
};
