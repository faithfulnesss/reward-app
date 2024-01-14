const createPaginatedView = require("./paginatedView");

const renderLeaderboardItem = (employee, index, currentPage, pageSize) => ({
    type: "section",
    text: {
        type: "mrkdwn",
        text: `*${index + 1 + (currentPage - 1) * pageSize}.* ${
            employee.Name
        } - ${employee.Balance} :star:`,
    },
});

const leaderboardView = (employees, currentPage, pageSize) => {
    return createPaginatedView(
        employees,
        currentPage,
        pageSize,
        renderLeaderboardItem,
        "Leaderboard",
        "leaderboard"
    );
};

module.exports = leaderboardView;
