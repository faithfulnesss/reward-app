const notionService = require("../services/notionService");
const {
    rewardRequestRepository,
    rewardRepository,
    employeeRepository,
} = require("../../database/repositories");
const logger = require("../../utils/logger");
const config = require("../../config");

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
            if (rewardRequest && rewardRequest.Status !== notionRecord.Status) {
                logger.info(
                    `Updating reward request ${rewardRequest._id} status to ${notionRecord.Status}`
                );
                await rewardRequestRepository.updateRewardRequest(
                    rewardRequest._id,
                    {
                        Status: notionRecord.Status,
                    }
                );
                if (notionRecord.Status === "Rejected") {
                    const employee = await employeeRepository.getEmployee({
                        _id: rewardRequest.Employee,
                    });
                    const reward = await rewardRepository.getReward({
                        _id: rewardRequest.Reward,
                    });
                    logger.info(
                        `Updating employee ${employee._id} balance\n
                        Balance of employee ${employee.Name} is ${employee.Balance}`
                    );
                    await employeeRepository.updateEmployee(
                        { _id: employee._id },
                        {
                            $inc: { Balance: reward.Points },
                        }
                    );
                    const updatedEmployee =
                        await employeeRepository.getEmployee({
                            _id: employee._id,
                        });
                    logger.info(
                        `Balance of employee ${updatedEmployee.Name} is ${updatedEmployee.Balance} after update`
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
                logger.info(rewardRequest);
                logger.info(
                    `Creating notion record for reward request ${rewardRequest._id}`
                );
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
        logger.error(error);
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
        Value: { rich_text: [{ text: { content: reward.Value ?? "" } }] },
    };
};

module.exports = syncRewardRequests;
