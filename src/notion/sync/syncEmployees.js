const app = require("../../slack/client");
const notion = require("../client");
require("dotenv").config();
const connectDB = require("../../database/connect");
const Employee = require("../../database/models/Employee");

// draft code to understand how to work with notion records

async function fetchNotionEmployees() {
  const notion_records = await notion.databases.query({
    database_id: process.env.EMPLOYEES_DB_ID,
  });

  return notion_records.results.map((page) => {
    const { Name, SlackID, Role, Balance } = page.properties;
    return {
      name: Name?.title[0]?.plain_text,
      slack_id: SlackID?.rich_text[0]?.plain_text,
      role: Role?.select?.name,
      balance: Balance?.number,
    };
  });
}

function getNewEmployees(dbEmployees, notionEmployees) {
  return dbEmployees.filter(
    (employee) =>
      !notionEmployees.some((ne) => ne.slack_id === employee.slack_id)
  );
}

async function createNotionRecords(newEmployees) {
  const createEmployeePromises = newEmployees.map(async (employee) => {
    try {
      await notion.pages.create({
        parent: { database_id: process.env.EMPLOYEES_DB_ID },
        properties: {
          Name: { title: [{ text: { content: employee.name } }] },
          SlackID: { rich_text: [{ text: { content: employee.slack_id } }] },
          Role: { select: { name: employee.role } },
          Balance: { number: employee.balance },
        },
      });
    } catch (error) {
      console.error(`Error creating employee record: ${error}`);
    }
  });

  await Promise.all(createEmployeePromises);
}

async function syncEmployees() {
  try {
    const [employees, notionEmployees] = await Promise.all([
      Employee.find(),
      fetchNotionEmployees(),
    ]);

    const newEmployees = getNewEmployees(employees, notionEmployees);
    await createNotionRecords(newEmployees);
  } catch (error) {
    console.error(`Error in syncEmployees: ${error.message}`);
  }
}
