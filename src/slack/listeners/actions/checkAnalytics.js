const {
    datePickerView,
    analyticsView,
    recognitionsListView,
} = require("../../views/analyticsView");

const errorView = require("../../views/errorView");
const createPaginatedView = require("../../views/paginatedView");

const {
    recognitionRepository,
    employeeRepository,
    rewardRequestRepository,
    awardRequestRepository,
} = require("../../../database/repositories");

const logger = require("../../../utils/logger");

module.exports = (app) => {
    app.action("check_analytics", async ({ ack, body, client }) => {
        await ack();

        try {
            await client.views.open({
                trigger_id: body.trigger_id,
                view: datePickerView,
            });
        } catch (error) {
            console.error(error);

            await client.views.open({
                trigger_id: body.trigger_id,
                view: errorView("Something went wrong!"),
            });
        }
    });

    app.view("fetch_analytics", async ({ ack, body, view, client }) => {
        await ack();

        const {
            startDate: {
                startDatePicker: { selected_date: startDateString },
            },
            endDate: {
                endDatePicker: { selected_date: endDateString },
            },
        } = view.state.values;

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        if (endDate < startDate) {
            await client.views.open({
                trigger_id: body.trigger_id,
                view: errorView("End date cannot be before start date"),
            });
        }

        try {
            const [
                recognitionsCount,
                employeesRecognized,
                percEmpRecognizeGiven,
                percMngrRecognizeGiven,
                recognitionsDistribution,
                balanceDistribution,
                rewardRequestsCount,
                awardRequestsDistribution,
                awardRequestsPopularity,
            ] = await Promise.all([
                recognitionRepository.getRecognitionsCount(startDate, endDate),
                recognitionRepository.getPercentageEmployeesRecognized(
                    startDate,
                    endDate
                ),
                recognitionRepository.getPercentageEmployeesRecognizeGiven(
                    startDate,
                    endDate
                ),
                recognitionRepository.getPercentageManagersRecognizeGiven(
                    startDate,
                    endDate
                ),
                recognitionRepository.getRecognitionsDistributionByValue(
                    startDate,
                    endDate
                ),
                employeeRepository.getBalanceDistributionByTeam(),
                rewardRequestRepository.getRewardRequestsCount(
                    startDate,
                    endDate
                ),
                awardRequestRepository.getAwardRequestsDistributionByType(
                    startDate,
                    endDate
                ),
                awardRequestRepository.getAwardRequestsDistributionByName(
                    startDate,
                    endDate
                ),
            ]);

            await client.views.open({
                trigger_id: body.trigger_id,
                view: analyticsView(
                    {
                        startDate: startDateString,
                        endDate: endDateString,
                        kudosSent: recognitionsCount,
                        employeesRecognized:
                            employeesRecognized[0]?.percentage || 0,
                        percEmpRecognizeGiven:
                            percEmpRecognizeGiven[0]?.percentage || 0,
                        percMngrRecognizeGiven:
                            percMngrRecognizeGiven[0]?.percentage || 0,
                        recognitionsDistribution: recognitionsDistribution,
                        balanceDistribution: balanceDistribution,
                        rewardRequestsCount: rewardRequestsCount,
                        awardRequestsDistribution: awardRequestsDistribution,
                        awardRequestsPopularity: awardRequestsPopularity,
                    },
                    { startDate: startDate, endDate: endDate }
                ),
            });
        } catch (error) {
            console.error(error);

            await client.views.open({
                trigger_id: body.trigger_id,
                view: errorView("Something went wrong!"),
            });
        }
    });

    app.action("open_recognitions_list", async ({ ack, body, client }) => {
        await ack();

        const { startDate, endDate } = JSON.parse(body.view.private_metadata);

        try {
            var recognitions = await recognitionRepository.getRecognitionsList(
                new Date(startDate),
                new Date(endDate)
            );

            await client.views.push({
                trigger_id: body.trigger_id,
                view: recognitionsListView(recognitions, 1),
            });
        } catch (error) {
            console.error(error);
            await client.views.open({
                trigger_id: body.trigger_id,
                view: errorView("Something went wrong!"),
            });
        }

        app.action(
            "recognitions_next",
            async ({ ack, body, client, action }) => {
                await ack();

                try {
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: recognitionsListView(recognitions, currentPage),
                    });
                } catch (error) {
                    console.error(error);
                    await client.views.open({
                        trigger_id: body.trigger_id,
                        view: errorView("Something went wrong!"),
                    });
                }
            }
        );

        app.action(
            "recognitions_previous",
            async ({ ack, body, client, action }) => {
                await ack();

                try {
                    const currentPage = parseInt(action.value);

                    await client.views.update({
                        view_id: body.view.id,
                        view: recognitionsListView(recognitions, currentPage),
                    });
                } catch (error) {
                    console.error(error);
                    await client.views.open({
                        trigger_id: body.trigger_id,
                        view: errorView("Something went wrong!"),
                    });
                }
            }
        );
    });
};
