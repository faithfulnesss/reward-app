const config = require("../../config");
const notionService = require("../services/notionService");
const employeeRepository = require("../../database/repositories/employeeRepository");
const connect = require("../../database/connect");

// sync logic
// 1. get all employees from notion
// 2. get all employees from database
// 3. compare employees from notion and database
// 4. if employee from notion is not in database - create it
// 5. if employee from notion is in database and has different
// role or team - update it

const syncEmployees = async () => {
  try {
    const notionEmployees = (
      await notionService.getNotionRecords(config.employeesDbId)
    ).map((page) => parseNotionEmployee(page));

    const databaseEmployees = await employeeRepository.getEmployees();

    for (const employee of databaseEmployees) {
      const notionRecord = notionEmployees.find(
        (notionEmployee) => notionEmployee.SlackID === employee.SlackID
      );

      if (!notionRecord) {
        await notionService.createNotionRecord(
          config.employeesDbId,
          mapNotionEmployee(employee)
        );
      } else if (
        notionRecord.Role !== employee.Role ||
        notionRecord.Team !== employee.Team
      ) {
        await employeeRepository.updateEmployee(
          { SlackID: employee.SlackID },
          {
            Role: notionRecord.Role,
            Team: notionRecord.Team,
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const parseNotionEmployee = (page) => {
  const { Name, SlackID, Role, Team, Balance } = page.properties;
  return {
    Name: Name?.title[0]?.plain_text,
    SlackID: SlackID?.rich_text[0]?.plain_text,
    Role: Role?.select?.name,
    Team: Team?.select?.name,
    Balance: Balance?.number,
  };
};

const mapNotionEmployee = (employee) => {
  return {
    Name: { title: [{ text: { content: employee.Name } }] },
    SlackID: {
      rich_text: [{ text: { content: employee.SlackID } }],
    },
    Role: { select: { name: employee.Role } },
    Team: { select: { name: employee.Team } },
  };
};

async function main() {
  connect();
  await syncEmployees();
}

main();

module.exports = syncEmployees;
