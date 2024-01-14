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

const getRewardRequestsCount = async (startDate, endDate) => {
    try {
        const count = await RewardRequest.countDocuments({
            CreatedAt: {
                $gte: startDate,
                $lte: endDate,
            },
            Status: { $ne: "Rejected" },
        });
        return count;
    } catch (error) {
        logger.error(error);
    }
};

const getListOfRewardRequests = async (startDate, endDate) => {
    try {
        const result = await RewardRequest.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                    Status: { $ne: "Rejected" },
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "Employee",
                    foreignField: "_id",
                    as: "EmployeeInfo",
                },
            },
            {
                $lookup: {
                    from: "rewards",
                    localField: "Reward",
                    foreignField: "_id",
                    as: "RewardInfo",
                },
            },
            {
                $addFields: {
                    EmployeeName: { $arrayElemAt: ["$EmployeeInfo.Name", 0] },
                    RewardName: { $arrayElemAt: ["$RewardInfo.Name", 0] },
                },
            },
            {
                $project: {
                    EmployeeInfo: 0,
                    RewardInfo: 0,
                },
            },
        ]);

        return result;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getRewardRequests,
    getRewardRequest,
    createRewardRequest,
    updateRewardRequest,
    getRewardRequestsCount,
    getListOfRewardRequests,
};
