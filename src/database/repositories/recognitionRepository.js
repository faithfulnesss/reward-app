const Recognition = require("../models/Recognition");
const employeeRepository = require("./employeeRepository");
const logger = require("../../utils/logger");

async function createRecognitions(
    senderSlackID,
    receiverSlackIDs,
    points,
    value
) {
    const createdRecognitions = [];

    const sender = await employeeRepository.getEmployee({
        SlackID: senderSlackID,
    });

    if (!sender) {
        throw new Error("Sender not found");
    }

    for (const receiverSlackID of receiverSlackIDs) {
        const receiver = await employeeRepository.getEmployee({
            SlackID: receiverSlackID,
        });

        if (!receiver) {
            throw new Error(
                `Receiver not found for SlackID: ${receiverSlackID}`
            );
        }

        const recognition = new Recognition({
            Sender: sender._id,
            Receiver: receiver._id,
            Points: points,
            Value: value,
        });

        await recognition.save();
        createdRecognitions.push(recognition);
    }

    return createdRecognitions.length === receiverSlackIDs.length;
}

async function getRecognitions(filter) {
    try {
        const recognitions = await Recognition.find(filter || {});
        return recognitions;
    } catch (error) {
        logger.error(error);
    }
}

async function getRecognitionsList(startDate, endDate) {
    try {
        const result = await Recognition.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "Sender",
                    foreignField: "_id",
                    as: "SenderInfo",
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "Receiver",
                    foreignField: "_id",
                    as: "ReceiverInfo",
                },
            },
            {
                $addFields: {
                    SenderName: { $arrayElemAt: ["$SenderInfo.Name", 0] },
                    ReceiverName: { $arrayElemAt: ["$ReceiverInfo.Name", 0] },
                },
            },
        ]);
        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getRecognitionsCount(startDate, endDate) {
    try {
        const count = await Recognition.countDocuments({
            CreatedAt: {
                $gte: startDate,
                $lte: endDate,
            },
        });
        return count;
    } catch (error) {
        logger.error(error);
    }
}

async function getPercentageEmployeesRecognized(startDate, endDate) {
    try {
        const employeesCount = await employeeRepository.getEmployeesCount({
            Joined: { $lte: endDate },
        });

        const result = await Recognition.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$Receiver",
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    percentage: {
                        $multiply: [
                            { $divide: ["$count", employeesCount] },
                            100,
                        ],
                    },
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getPercentageEmployeesRecognizeGiven(startDate, endDate) {
    try {
        const employeesCount = await employeeRepository.getEmployeesCount({
            Joined: { $lte: endDate },
        });

        const result = await Recognition.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },

            {
                $group: {
                    _id: "$Sender",
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Sender",
                },
            },
            {
                $unwind: "$Sender",
            },
            // if the employee list is empty - then it returns empty array
            {
                $match: {
                    "Sender.Role": { $eq: "Employee" },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    percentage: {
                        $multiply: [
                            { $divide: ["$count", employeesCount] },
                            100,
                        ],
                    },
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getPercentageManagersRecognizeGiven(startDate, endDate) {
    try {
        const employeesCount = await employeeRepository.getEmployeesCount({
            Joined: { $lte: endDate },
            Role: { $in: ["HR", "Manager"] },
        });

        const result = await Recognition.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$Sender",
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Sender",
                },
            },
            {
                $unwind: "$Sender",
            },
            // if the HR/Manager list is empty - then it returns empty array
            {
                $match: {
                    "Sender.Role": { $in: ["HR", "Manager"] },
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    percentage: {
                        $multiply: [
                            { $divide: ["$count", employeesCount] },
                            100,
                        ],
                    },
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

const getRecognitionsDistributionByValue = async (startDate, endDate) => {
    try {
        const result = await Recognition.aggregate([
            {
                $match: {
                    CreatedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$Value",
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$count" },
                    values: { $push: { value: "$_id", total: "$count" } },
                },
            },
            {
                $unwind: "$values",
            },
            {
                $project: {
                    _id: 0,
                    value: "$values.value",
                    percentage: {
                        $multiply: [
                            { $divide: ["$values.total", "$total"] },
                            100,
                        ],
                    },
                },
            },
        ]);
        return result;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    createRecognitions,
    getRecognitions,
    getRecognitionsList,
    getRecognitionsCount,
    getPercentageEmployeesRecognized,
    getPercentageEmployeesRecognizeGiven,
    getRecognitionsDistributionByValue,
    getPercentageManagersRecognizeGiven,
};
