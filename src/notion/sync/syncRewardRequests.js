const config = require("../../config");
const notionService = require("../services/notionService");
const rewardRequestRepository = require("../../database/repositories/rewardRequestRepository");
const rewardRepository = require("../../database/repositories/rewardRepository");
const employeeRepository = require("../../database/repositories/employeeRepository");

// sync logic
// 1. get all employees from notion
// 2. get all employees from database
// 3. compare employees from notion and database
// 4. if employee from notion is not in database - create it
// 5. if employee from notion is in database and has different
// role or team - update it

const syncRewardRequests = async () => {
    try {
        const notionRewardRequests = (
            await notionService.getNotionRecords(config.rewardRequestsDbId)
        ).map((page) => parseNotionRewardRequests(page));

        const databaseRewardRequests =
            await rewardRequestRepository.getRewardRequests();

        for (const notionRecord of notionRewardRequests) {
            const rewardRequest = databaseRewardRequests.find(
                (rewardRequest) =>
                    rewardRequest._id.toString() === notionRecord.ID
            );
            if (rewardRequest.Status !== notionRecord.Status) {
                await rewardRequestRepository.updateRewardRequest(
                    rewardRequest._id,
                    {
                        Status: notionRecord.Status,
                    }
                );
                if (notionRecord.Status === "Declined") {
                    const employee = await employeeRepository.getEmployee({
                        _id: rewardRequest.Employee,
                    });
                    const reward = await rewardRepository.getReward({
                        _id: rewardRequest.Reward,
                    });
                    await employeeRepository.updateEmployee(
                        { _id: employee._id },
                        {
                            Balance: employee.Balance + reward.Points,
                        }
                    );
                }
            }
        }

        for (const rewardRequest of databaseRewardRequests) {
            const notionRecord = notionRewardRequests.find(
                (notionRewardRequest) =>
                    notionRewardRequest.ID === rewardRequest._id.toString()
            );

            if (!notionRecord && rewardRequest.Status === "Pending") {
                const reward = await rewardRepository.getReward({
                    _id: rewardRequest.Reward,
                });
                const employee = await employeeRepository.getEmployee({
                    _id: rewardRequest.Employee,
                });
                await notionService.createNotionRecord(
                    config.rewardRequestsDbId,
                    mapNotionRewardRequest(rewardRequest, reward, employee)
                );
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const parseNotionRewardRequests = (page) => {
    const { ID, Requester, Reward, Points, Value, Status } = page.properties;
    return {
        ID: ID?.rich_text[0]?.plain_text,
        Requester: Requester?.title[0]?.plain_text,
        Reward: Reward?.rich_text[0]?.plain_text,
        Status: Status?.select?.name,
        Points: Points?.number,
        Value: Value?.rich_text[0]?.plain_text,
    };
};

const mapNotionRewardRequest = (rewardRequest, reward, employee) => {
    return {
        ID: { rich_text: [{ text: { content: rewardRequest._id } }] },
        Requester: { title: [{ text: { content: employee.Name } }] },
        Reward: { rich_text: [{ text: { content: reward.Name } }] },
        Status: { select: { name: rewardRequest.Status } },
        Points: { number: reward.Points },
        Value: { rich_text: [{ text: { content: reward.Value } }] },
    };
};

module.exports = syncRewardRequests;
