const Employee = require("../models/Employee");
const logger = require("../../utils/logger");

const createEmployee = async (slackId, name) => {
    try {
        const createdEmployee = await Employee.create({
            SlackID: slackId,
            Name: name,
        });
        return createdEmployee;
    } catch (error) {
        logger.error(error);
    }
};

const getEmployees = async (filter) => {
    try {
        const employees = await Employee.find(filter || {});
        return employees;
    } catch (error) {
        logger.error(error);
    }
};

const getEmployeesSortedByBalanceDescending = async (filter) => {
    try {
        const employees = await Employee.find(filter || {}).sort({
            Balance: -1,
        });
        return employees;
    } catch (error) {
        logger.error(error);
    }
};

const getEmployeesCount = async (filter) => {
    try {
        const employeesCount = await Employee.countDocuments(filter || {});
        return employeesCount;
    } catch (error) {
        logger.error(error);
    }
};

const getEmployee = async (filter) => {
    try {
        const employee = await Employee.findOne(filter || {});
        return employee;
    } catch (error) {
        logger.error(error);
    }
};

const getEmployeeBalance = async (slackId) => {
    try {
        const employee = await Employee.findOne({ SlackID: slackId });

        return employee.Balance;
    } catch (error) {
        logger.error(error);
    }
};

const employeeExists = async (slackId) => {
    try {
        const employee = await Employee.findOne({ SlackID: slackId });
        return !!employee;
    } catch (error) {
        logger.error(error);
    }
};

const updateEmployee = async (filter, update) => {
    try {
        const employee = await Employee.findOneAndUpdate(filter, update);
        return employee;
    } catch (error) {
        logger.error(error);
    }
};

const resetManagersBalance = async (slackId = null) => {
    try {
        const query = { Role: { $in: ["Manager", "HR"] } };
        if (slackId) {
            query.SlackID = slackId;
        }
        await Employee.updateMany(query, { ManagerBalance: 500 });
    } catch (error) {
        logger.error(error);
    }
};

const getBalanceDistributionByTeam = async () => {
    try {
        const result = await Employee.aggregate([
            {
                $group: {
                    _id: "$Team",
                    total: { $sum: "$Balance" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: "$total" },
                    teams: { $push: { team: "$_id", total: "$total" } },
                },
            },
            {
                $unwind: "$teams",
            },
            {
                $project: {
                    _id: 0,
                    team: "$teams.team",
                    percentage: {
                        $multiply: [
                            { $divide: ["$teams.total", "$totalBalance"] },
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

async function getUnrecognizedEmployeesList(startDate, endDate, teamName) {
    try {
        const result = await Employee.aggregate([
            {
                $match: {
                    Team: teamName,
                    Joined: { $lte: endDate },
                },
            },
            {
                $lookup: {
                    from: "recognitions",
                    let: { employeeId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$Receiver", "$$employeeId"] },
                                        { $gte: ["$CreatedAt", startDate] },
                                        { $lte: ["$CreatedAt", endDate] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "recognitions",
                },
            },
            {
                $match: {
                    recognitions: { $size: 0 },
                },
            },
            {
                $project: {
                    _id: 1,
                    Name: 1,
                    Joined: 1,
                    Team: 1,
                },
            },
            {
                $sort: {
                    Team: 1,
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
    }
}

async function getUnrecognizedEmployeesCount(startDate, endDate) {
    try {
        const result = await Employee.aggregate([
            {
                $match: {
                    Joined: { $lte: endDate },
                },
            },
            {
                $lookup: {
                    from: "recognitions",
                    let: { employeeId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$Receiver", "$$employeeId"] },
                                        { $gte: ["$CreatedAt", startDate] },
                                        { $lte: ["$CreatedAt", endDate] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "recognitions",
                },
            },
            {
                $match: {
                    recognitions: { $size: 0 },
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
                    count: 1,
                },
            },
        ]);

        return result.length > 0 ? result[0].count : 0;
    } catch (error) {
        logger.error(error);
    }
}

async function getTeamsWithUnrecognizedEmployees(startDate, endDate) {
    try {
        const result = await Employee.aggregate([
            {
                $lookup: {
                    from: "recognitions",
                    let: { employeeId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$Receiver", "$$employeeId"] },
                                        { $gte: ["$CreatedAt", startDate] },
                                        { $lte: ["$CreatedAt", endDate] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "recognitions",
                },
            },
            {
                $match: {
                    recognitions: { $size: 0 },
                },
            },
            {
                $group: {
                    _id: "$Team",
                },
            },
            {
                $project: {
                    _id: 0,
                    Name: "$_id",
                },
            },
        ]);

        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

module.exports = {
    getEmployee,
    getEmployees,
    getEmployeeBalance,
    getEmployeesCount,
    getEmployeesSortedByBalanceDescending,
    employeeExists,
    createEmployee,
    updateEmployee,
    resetManagersBalance,
    getBalanceDistributionByTeam,
    getUnrecognizedEmployeesList,
    getUnrecognizedEmployeesCount,
    getTeamsWithUnrecognizedEmployees,
};
