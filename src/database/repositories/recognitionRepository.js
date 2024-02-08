const Recognition = require("../models/Recognition");
const employeeRepository = require("./employeeRepository");
const logger = require("../../utils/logger");

const createRecognitionsTest = async (
    senderSlackID,
    receiverSlackIDs,
    points,
    managerPoints,
    value
) => {
    const createdRecognitions = [];
    let originalSenderBalance = null;
    let originalReceiverBalances = new Map();

    try {
        logger.info("Creating recognitions");

        const sender = await employeeRepository.getEmployee({
            SlackID: senderSlackID,
        });

        if (!sender) {
            logger.info(`Sender not found ${senderSlackID}`);
            throw new Error("Sender not found");
        }

        logger.info(`Sender found ${sender}`);

        originalSenderBalance = {
            Balance: sender.Balance,
            ManagerBalance: sender.ManagerBalance,
        };

        logger.info(`Original sender balance ${originalSenderBalance}`);

        for (const receiverSlackID of receiverSlackIDs) {
            const receiver = await employeeRepository.getEmployee({
                SlackID: receiverSlackID,
            });

            if (!receiver) {
                throw new Error(
                    `Receiver not found for SlackID: ${receiverSlackID}`
                );
            }

            logger.info(`Receiver found ${receiver}`);
            logger.info(`Original receiver balance ${receiver.Balance}`);

            originalReceiverBalances.set(receiver._id, receiver.Balance);
        }

        for (const receiverSlackID of receiverSlackIDs) {
            const receiver = await employeeRepository.getEmployee({
                SlackID: receiverSlackID,
            });

            let update = {};
            let totalPointsGiven = 0;

            logger.info(
                `Called with such arguments ${managerPoints}, ${points}`
            );
            if (sender.Role !== "Employee") {
                if (managerPoints && managerPoints > 0) {
                    logger.info(
                        `Manager ${sender.Name} give manager points = ${managerPoints}`
                    );
                    update = { $inc: { ManagerBalance: -managerPoints } };
                    totalPointsGiven += +managerPoints;
                }
            }

            if (points && points > 0) {
                logger.info(`Employee ${sender.Name} give points = ${points}`);
                update = {
                    ...update,
                    $inc: { ...update.$inc, Balance: -points },
                };
                totalPointsGiven += +points;
            }

            logger.info(
                `In total employee ${sender.Name} give points = ${totalPointsGiven} to the ${receiver.Name}`
            );

            await employeeRepository.updateEmployee(
                { _id: sender._id },
                update
            );
            await employeeRepository.updateEmployee(
                { _id: receiver._id },
                {
                    $inc: { Balance: totalPointsGiven },
                }
            );

            const recognition = new Recognition({
                Sender: sender._id,
                Receiver: receiver._id,
                Points: points,
                Value: value,
            });

            await recognition.save();
            createdRecognitions.push(recognition);
        }

        return createdRecognitions;
    } catch (error) {
        logger.error(error);

        if (originalSenderBalance !== null) {
            await employeeRepository.updateEmployee(
                { SlackID: senderSlackID },
                {
                    $set: {
                        Balance: originalSenderBalance.Balance,
                        ManagerBalance: originalSenderBalance.ManagerBalance,
                    },
                }
            );
        }
        for (const [receiverId, originalBalance] of originalReceiverBalances) {
            await employeeRepository.updateEmployee(
                { _id: receiverId },
                {
                    $set: { Balance: originalBalance },
                }
            );
        }

        // Delete recognitions created during this process
        for (const recognition of createdRecognitions) {
            await recognition.remove();
        }

        throw error; // Rethrow the error for further handling if necessary
    }
};

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

async function getRecognitionsListAggregated(startDate, endDate) {
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
                $facet: {
                    Received: [
                        { $group: { _id: "$Receiver", Received: { $sum: 1 } } },
                    ],
                    Given: [{ $group: { _id: "$Sender", Given: { $sum: 1 } } }],
                },
            },
            {
                $project: {
                    All: { $concatArrays: ["$Received", "$Given"] },
                },
            },
            {
                $unwind: "$All",
            },
            {
                $replaceRoot: { newRoot: "$All" },
            },
            {
                $group: {
                    _id: "$_id",
                    Recognitions: {
                        $push: {
                            k: {
                                $cond: {
                                    if: { $gt: ["$Received", null] },
                                    then: "Received",
                                    else: "Given",
                                },
                            },
                            v: "$$ROOT",
                        },
                    },
                },
            },
            {
                $project: {
                    Recognitions: { $arrayToObject: "$Recognitions" },
                },
            },
            {
                $project: {
                    Received: {
                        $ifNull: ["$Recognitions.Received.Received", 0],
                    },
                    Given: { $ifNull: ["$Recognitions.Given.Given", 0] },
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "EmployeeInfo",
                },
            },
            {
                $project: {
                    _id: 0,
                    Name: { $arrayElemAt: ["$EmployeeInfo.Name", 0] },
                    Received: 1,
                    Given: 1,
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getEmployeesWithRecognitions(startDate, endDate) {
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
                    _id: null,
                    senders: { $addToSet: "$Sender" },
                    receivers: { $addToSet: "$Receiver" },
                },
            },
            {
                $project: {
                    allIds: { $setUnion: ["$senders", "$receivers"] },
                },
            },
            {
                $unwind: "$allIds",
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "allIds",
                    foreignField: "_id",
                    as: "Employee",
                },
            },
            {
                $unwind: "$Employee",
            },
            {
                $project: {
                    _id: 0,
                    Name: "$Employee.Name",
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getEmployeeRecognitions(startDate, endDate, employeeName) {
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
                $unwind: "$SenderInfo",
            },
            {
                $unwind: "$ReceiverInfo",
            },
            {
                $match: {
                    $or: [
                        { "SenderInfo.Name": employeeName },
                        { "ReceiverInfo.Name": employeeName },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    Points: "$Points",
                    Date: "$CreatedAt",
                    SenderName: "$SenderInfo.Name",
                    ReceiverName: "$ReceiverInfo.Name",
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
            // if te HR/Manager list is empty - then it returns empty array
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

async function getManagerRecognitions(startDate, endDate, name) {
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
                    as: "SenderDetails",
                },
            },
            {
                $unwind: "$SenderDetails",
            },
            {
                $match: {
                    "SenderDetails.Name": name,
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "Receiver",
                    foreignField: "_id",
                    as: "ReceiverDetails",
                },
            },
            {
                $unwind: "$ReceiverDetails",
            },
            {
                $project: {
                    _id: 0,
                    Points: "$Points",
                    Date: "$CreatedAt",
                    SenderName: "$SenderDetails.Name",
                    ReceiverName: "$ReceiverDetails.Name",
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getManagersRecognizeGivenList(startDate, endDate) {
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
                    as: "SenderDetails",
                },
            },
            {
                $unwind: "$SenderDetails",
            },
            {
                $match: {
                    "SenderDetails.Role": { $in: ["HR", "Manager"] },
                },
            },
            {
                $group: {
                    _id: "$SenderDetails._id",
                    Name: { $first: "$SenderDetails.Name" },
                },
            },
            {
                $project: {
                    _id: 0,
                    Name: 1,
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
    getManagersRecognizeGivenList,
    getRecognitionsListAggregated,
    getManagerRecognitions,
    getEmployeeRecognitions,
    getEmployeesWithRecognitions,
    createRecognitionsTest,
};
