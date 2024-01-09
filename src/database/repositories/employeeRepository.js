const Employee = require("../models/Employee");

const connectDB = require("../connect");

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

    const employeeRole = employee.Role;

    return employeeRole === "Employee"
      ? employee.Balance
      : employee.Balance + employee.ManagerBalance;
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

module.exports = {
  getEmployee,
  getEmployees,
  getEmployeeBalance,
  employeeExists,
  createEmployee,
  updateEmployee,
};
