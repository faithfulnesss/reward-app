const { createPaginatedView } = require("./paginatedView");

const renderLeaderboardItem = (employee, index, currentPage, pageSize) => ({
    type: "section",
    text: {
        type: "mrkdwn",
        text: `*${index + 1 + (currentPage - 1) * pageSize}.* ${
            employee.Name
        } - ${employee.Team} - ${employee.Balance} :star:`,
    },
});

const leaderboardView = (employees, currentPage) => {
    return createPaginatedView(
        employees,
        currentPage,
        12,
        renderLeaderboardItem,
        "Leaderboard",
        "leaderboard"
    );
};

module.exports = leaderboardView;
