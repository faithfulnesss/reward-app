const {
    recognitionRepository,
    employeeRepository,
    rewardRequestRepository,
    awardRequestRepository,
} = require("../../../database/repositories");
const {
    datePickerView,
    analyticsView,
    recognitionsListView,
    rewardRequestsListView,
    recognitionsByManagers,
    recognitionsByEmployee,
    awardRequestsByType,
    unrecognizedByTeam,
} = require("../../views/analyticsView");
const {
    buildPaginatedView,
    buildSelectiveView,
} = require("../../views/paginatedView");
const openErrorView = require("./openErrorView");
const logger = require("../../../utils/logger");

const fetchAnalyticsData = async (startDate, endDate) => {
    return await Promise.all([
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
        rewardRequestRepository.getRewardRequestsCount(startDate, endDate),
        awardRequestRepository.getAwardRequestsDistributionByType(
            startDate,
            endDate
        ),
        awardRequestRepository.getAwardRequestsDistributionByName(
            startDate,
            endDate
        ),
        awardRequestRepository.getAwardRequestsCount(startDate, endDate),
        employeeRepository.getUnrecognizedEmployeesCount(startDate, endDate),
    ]);
};

const createViewData = (analyticsData, startDateString, endDateString) => {
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
        awardRequestsCount,
        unrecognizedCount,
    ] = analyticsData;

    return {
        startDate: startDateString,
        endDate: endDateString,
        kudosSent: recognitionsCount,
        employeesRecognized: employeesRecognized[0]?.percentage || 0,
        percEmpRecognizeGiven: percEmpRecognizeGiven[0]?.percentage || 0,
        percMngrRecognizeGiven: percMngrRecognizeGiven[0]?.percentage || 0,
        recognitionsDistribution: recognitionsDistribution,
        balanceDistribution: balanceDistribution,
        rewardRequestsCount: rewardRequestsCount,
        awardRequestsDistribution: awardRequestsDistribution,
        awardRequestsPopularity: awardRequestsPopularity,
        awardRequestsCount: awardRequestsCount,
        unrecognizedCount: unrecognizedCount,
    };
};

module.exports = (app) => {
    app.action("check_analytics", async ({ ack, body, client }) => {
        await ack();

        try {
            await client.views.open({
                trigger_id: body.trigger_id,
                view: datePickerView,
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
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
            await openErrorView(
                client,
                body.trigger_id,
                "End date cannot be before start date"
            );
            return;
        }

        try {
            const analyticsData = await fetchAnalyticsData(startDate, endDate);
            const viewData = createViewData(
                analyticsData,
                startDateString,
                endDateString
            );

            await client.views.open({
                trigger_id: body.trigger_id,
                view: analyticsView(viewData, {
                    startDate: startDate,
                    endDate: endDate,
                }),
            });
        } catch (error) {
            logger.error(error);
            await openErrorView(client, body.trigger_id);
        }
    });

    buildPaginatedView(
        app,
        "open_recognitions_list",
        "recognitions_next",
        "recognitions_previous",
        recognitionRepository.getRecognitionsListAggregated,
        recognitionsListView
    );

    buildPaginatedView(
        app,
        "open_rewards_list",
        "rewards_next",
        "rewards_previous",
        rewardRequestRepository.getRewardRequestsList,
        rewardRequestsListView
    );

    buildSelectiveView(
        app,
        "open_managers_list",
        "manager_selected",
        recognitionRepository.getManagersRecognizeGivenList,
        recognitionRepository.getManagerRecognitions,
        (values) => values.manager_selector.manager_selected.selected_option,
        recognitionsByManagers
    );

    buildSelectiveView(
        app,
        "open_recognitions_by_employee",
        "employee_selected",
        recognitionRepository.getEmployeesWithRecognitions,
        recognitionRepository.getEmployeeRecognitions,
        (values) => values.employee_selector.employee_selected.selected_option,
        recognitionsByEmployee
    );

    buildSelectiveView(
        app,
        "open_activities_list",
        "award_type_selected",
        awardRequestRepository.getAwardRequestsCountByType,
        awardRequestRepository.getAwardRequestsListByType,
        (values) =>
            values.award_type_selector.award_type_selected.selected_option,
        awardRequestsByType
    );

    buildSelectiveView(
        app,
        "open_unrecognized_list",
        "unrecognized_team_selected",
        employeeRepository.getTeamsWithUnrecognizedEmployees,
        employeeRepository.getUnrecognizedEmployeesList,
        (values) =>
            values.unrecognized_team_selector.unrecognized_team_selected
                .selected_option,
        unrecognizedByTeam
    );
};
