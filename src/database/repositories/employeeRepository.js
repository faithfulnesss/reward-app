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
        console.error(error);
    }
};

const getEmployees = async () => {
    try {
        const employees = await Employee.find();
        return employees;
    } catch (error) {
        console.error(error);
    }
};

const getEmployeesCount = async (filter) => {
    try {
        const employeesCount = await Employee.countDocuments(filter || {});
        return employeesCount;
    } catch (error) {
        console.error(error);
    }
};

const getEmployee = async (filter) => {
    try {
        const employee = await Employee.findOne(filter || {});
        return employee;
    } catch (error) {
        console.error(error);
    }
};

const getEmployeeBalance = async (slackId) => {
    try {
        const employee = await Employee.findOne({ SlackID: slackId });

        return employee.Balance;
    } catch (error) {
        console.error(error);
    }
};

const employeeExists = async (slackId) => {
    try {
        const employee = await Employee.findOne({ SlackID: slackId });
        return !!employee;
    } catch (error) {
        console.error(error);
    }
};

const updateEmployee = async (filter, update) => {
    try {
        const employee = await Employee.findOneAndUpdate(filter, update);
        return employee;
    } catch (error) {
        console.error(error);
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
        console.error(error);
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

module.exports = {
    getEmployee,
    getEmployees,
    getEmployeeBalance,
    employeeExists,
    createEmployee,
    updateEmployee,
    getEmployeesCount,
    getBalanceDistributionByTeam,
    resetManagersBalance,
};
