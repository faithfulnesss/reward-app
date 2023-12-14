const Employee = require("../models/Employee");

const getEmployee = async (slackId) => {
  try {
    const employee = await Employee.findOne({
      SlackID: slackId,
    });
    return employee;
  } catch (error) {
    console.error(error);
  }
};

const getEmployeesBalance = async (slackId) => {
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

module.exports = {
  getEmployee,
  getEmployeesBalance,
  employeeExists,
};
