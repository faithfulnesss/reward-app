const config = require("../../config");
const notionService = require("../services/notionService");
const awardRequestRepository = require("../../database/repositories/awardRequestRepository");
const awardRepository = require("../../database/repositories/awardRepository");
const employeeRepository = require("../../database/repositories/employeeRepository");
const connectDB = require("../../database/connect");
// sync logic
// 1. get all employees from notion
// 2. get all employees from database
// 3. compare employees from notion and database
// 4. if employee from notion is not in database - create it
// 5. if employee from notion is in database and has different
// role or team - update it

const syncAwardRequests = async () => {
  try {
    const notionAwardRequests = (
      await notionService.getNotionRecords(config.awardRequestsDbId)
    ).map((page) => parseNotionAwardRequests(page));

    const databaseAwardRequests =
      await awardRequestRepository.getAwardRequests();

    for (const notionRecord of notionAwardRequests) {
      const awardRequest = databaseAwardRequests.find(
        (awardRequest) => awardRequest._id.toString() === notionRecord.ID
      );
      if (awardRequest.Status !== notionRecord.Status) {
        await awardRequestRepository.updateAwardRequest(awardRequest._id, {
          Status: notionRecord.Status,
        });
        if (notionRecord.Status === "Approved") {
          const employee = await employeeRepository.getEmployee({
            _id: awardRequest.Employee,
          });
          const award = await awardRepository.getAward({
            _id: awardRequest.Award,
          });
          await employeeRepository.updateEmployee(
            { _id: employee._id },
            {
              Balance: employee.Balance + award.Points,
            }
          );
        }
      }
    }

    for (const awardRequest of databaseAwardRequests) {
      const notionRecord = notionAwardRequests.find(
        (notionAwardRequest) =>
          notionAwardRequest.ID === awardRequest._id.toString()
      );

      if (!notionRecord && awardRequest.Status === "Pending") {
        const award = await awardRepository.getAward({
          _id: awardRequest.Award,
        });
        const employee = await employeeRepository.getEmployee({
          _id: awardRequest.Employee,
        });
        await notionService.createNotionRecord(
          config.awardRequestsDbId,
          mapNotionAwardRequest(awardRequest, award, employee)
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const parseNotionAwardRequests = (page) => {
  const { ID, Requester, Award, Status, Type } = page.properties;
  return {
    ID: ID?.rich_text[0]?.plain_text,
    Requester: Requester?.title[0]?.plain_text,
    Award: Award?.rich_text[0]?.plain_text,
    Status: Status?.select?.name,
    Type: Type?.select?.name,
  };
};

const mapNotionAwardRequest = (awardRequest, award, employee) => {
  return {
    ID: { rich_text: [{ text: { content: awardRequest._id } }] },
    Requester: { title: [{ text: { content: employee.Name } }] },
    Award: { rich_text: [{ text: { content: award.Name } }] },
    Status: { select: { name: awardRequest.Status } },
    Type: { select: { name: award.Type } },
  };
};

async function main() {
  connectDB();
  await syncAwardRequests();
}

main();

// module.exports = syncEmployees;
