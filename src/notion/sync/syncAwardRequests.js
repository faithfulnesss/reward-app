const config = require("../../config");
const notionService = require("../services/notionService");
const awardRequestRepository = require("../../database/repositories/awardRequestRepository");
const awardRepository = require("../../database/repositories/awardRepository");
const employeeRepository = require("../../database/repositories/employeeRepository");

// sync logic
// 1. get all award requests from notion
// 2. get all award requests from database
// 3. compare award requests from notion and database
// 4. if award request status changed to approved in notion
// - update it in database and add points to the balance of the employee
// 5. if award request from database is not in notion - add it to notion

const syncAwardRequests = async () => {
    try {
        const notionAwardRequests = (
            await notionService.getNotionRecords(config.awardRequestsDbId)
        ).map((page) => parseNotionAwardRequests(page));

        const databaseAwardRequests =
            await awardRequestRepository.getAwardRequests();

        for (const notionRecord of notionAwardRequests) {
            const awardRequest = databaseAwardRequests.find(
                (awardRequest) =>
                    awardRequest._id.toString() === notionRecord.ID
            );
            if (awardRequest.Status !== notionRecord.Status) {
                await awardRequestRepository.updateAwardRequest(
                    awardRequest._id,
                    {
                        Status: notionRecord.Status,
                    }
                );
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

module.exports = syncAwardRequests;
