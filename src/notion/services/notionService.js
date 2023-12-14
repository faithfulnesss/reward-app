const notion = require("../client");
const config = require("../../config");

// to-do
// implement a function for fetching records from the notion
// that will accept two arguments - databaseId and filter
// code below is just a draft

async function getNotionEmployees() {
  let employees = [];
  let hasNextPage = null;
  let startCursor = undefined;

  try {
    do {
      const response = await notion.databases.query({
        database_id: config.employeesDbId,
        start_cursor: startCursor,
        page_size: 100,
      });

      employees = [
        ...employees,
        ...response.results.map((page) => {
          const { Name, SlackID, Role, Team, Balance, ManagerBalance, Joined } =
            page.properties;
          return {
            Name: Name?.title[0]?.plain_text,
            SlackID: SlackID?.rich_text[0]?.plain_text,
            Role: Role?.select?.name,
            Team: Team?.select?.name,
            Balance: Balance?.number,
            ManagerBalance: ManagerBalance?.number,
            Joined: Joined?.date?.start,
          };
        }),
      ];

      hasNextPage = response.has_more;

      startCursor = response.next_cursor;
    } while (hasNextPage);
  } catch (error) {
    console.error(`Failed to get employees from Notion: ${error}`);
  }

  return employees;
}

async function getNotionAwards() {
  const response = await notion.databases.query({
    database_id: config.awardsDbId,
  });

  const awards = response.results.map((page) => {
    const { Type, Name, Stars, Details } = page.properties;
    return {
      Type: Type?.select?.name,
      Name: Name?.title[0]?.plain_text,
      Stars: Stars?.number,
      Details: Details?.rich_text[0]?.plain_text,
    };
  });

  console.log(awards);
  return awards;
}

getNotionAwards();

module.exports = { getNotionEmployees, getNotionAwards };
