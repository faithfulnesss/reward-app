const AwardRequest = require("../models/AwardRequest");
const awardRepository = require("./awardRepository");
const employeeRepository = require("./employeeRepository");
const logger = require("../../utils/logger");

const createAwardRequest = async (employeeId, awardId) => {
    try {
        const award = await awardRepository.getAward({ _id: awardId });
        const employee = await employeeRepository.getEmployee({
            SlackID: employeeId,
        });

        const createdAwardRequest = await AwardRequest.create({
            Employee: employee._id,
            Award: award._id,
        });
        return createdAwardRequest;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequests = async (filter) => {
    try {
        const awardRequests = await AwardRequest.find(filter || {});
        return awardRequests;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequest = async (filter) => {
    try {
        const awardRequest = await AwardRequest.findOne(filter || {});
        return awardRequest;
    } catch (error) {
        logger.error(error);
    }
};

const updateAwardRequest = async (awardRequestId, update) => {
    try {
        const updatedAwardRequest = await AwardRequest.findByIdAndUpdate(
            awardRequestId,
            update
        );
        return updatedAwardRequest;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequestsCount = async (startDate, endDate) => {
    try {
        const count = await AwardRequest.countDocuments({
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

const getAwardRequestsDistributionByType = async (startDate, endDate) => {
    try {
        const totalCount = await AwardRequest.countDocuments({
            CreatedAt: { $gte: startDate, $lte: endDate },
            Status: { $ne: "Rejected" },
        });

        const result = await AwardRequest.aggregate([
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
                    from: "awards",
                    localField: "Award",
                    foreignField: "_id",
                    as: "award",
                },
            },
            {
                $unwind: "$award",
            },
            {
                $group: {
                    _id: "$award.Type",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    type: "$_id",
                    _id: 0,
                    percentage: {
                        $multiply: [{ $divide: ["$count", totalCount] }, 100],
                    },
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequestsCountByType = async (startDate, endDate) => {
    try {
        const result = await AwardRequest.aggregate([
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
                    from: "awards",
                    localField: "Award",
                    foreignField: "_id",
                    as: "award",
                },
            },
            {
                $unwind: "$award",
            },
            {
                $group: {
                    _id: "$award.Type",
                    Count: { $sum: 1 },
                },
            },
            {
                $project: {
                    Type: "$_id",
                    _id: 0,
                    Count: "$Count",
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequestsDistributionByName = async (startDate, endDate) => {
    try {
        const totalCount = await AwardRequest.countDocuments({
            CreatedAt: { $gte: startDate, $lte: endDate },
            Status: { $ne: "Rejected" },
        });

        const result = await AwardRequest.aggregate([
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
                    from: "awards",
                    localField: "Award",
                    foreignField: "_id",
                    as: "award",
                },
            },
            {
                $unwind: "$award",
            },
            {
                $group: {
                    _id: "$award.Name",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    name: "$_id",
                    _id: 0,
                    percentage: {
                        $multiply: [{ $divide: ["$count", totalCount] }, 100],
                    },
                },
            },
            {
                $sort: { percentage: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequestsList = async (startDate, endDate) => {
    try {
        const result = await AwardRequest.aggregate([
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
                    from: "awards",
                    localField: "Award",
                    foreignField: "_id",
                    as: "AwardInfo",
                },
            },
            {
                $addFields: {
                    EmployeeName: { $arrayElemAt: ["$EmployeeInfo.Name", 0] },
                    AwardName: { $arrayElemAt: ["$AwardInfo.Name", 0] },
                },
            },
            {
                $project: {
                    EmployeeInfo: 0,
                    AwardInfo: 0,
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
};

const getAwardRequestsListByType = async (startDate, endDate, type) => {
    try {
        const result = await AwardRequest.aggregate([
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
                    from: "awards",
                    localField: "Award",
                    foreignField: "_id",
                    as: "AwardInfo",
                },
            },
            {
                $match: {
                    "AwardInfo.Type": type,
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
                $addFields: {
                    EmployeeName: { $arrayElemAt: ["$EmployeeInfo.Name", 0] },
                    AwardName: { $arrayElemAt: ["$AwardInfo.Name", 0] },
                },
            },
            {
                $project: {
                    EmployeeInfo: 0,
                    AwardInfo: 0,
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    getAwardRequests,
    getAwardRequest,
    createAwardRequest,
    updateAwardRequest,
    getAwardRequestsCount,
    getAwardRequestsDistributionByType,
    getAwardRequestsDistributionByName,
    getAwardRequestsList,
    getAwardRequestsCountByType,
    getAwardRequestsListByType,
};
