const paginate = (array, pageSize, pageNumber) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
};

const createLeaderboardBlocks = (employees, currentPage, pageSize) => {
  const paginatedEmployees = paginate(employees, pageSize, currentPage);
  const employeeBlocks = paginatedEmployees.map((employee, index) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${index + 1 + (currentPage - 1) * pageSize}.* ${
        employee.Name
      } - ${employee.Balance} points`,
    },
  }));

  return employeeBlocks;
};

const leaderboardView = (employees, currentPage, pageSize) => {
  const totalPages = Math.ceil(employees.length / pageSize);

  const buttons = [];
  if (currentPage > 1) {
    buttons.push({
      type: "button",
      text: { type: "plain_text", text: "Previous" },
      action_id: "leaderboard_previous",
      value: String(currentPage - 1),
    });
  }
  if (currentPage < totalPages) {
    buttons.push({
      type: "button",
      text: { type: "plain_text", text: "Next" },
      action_id: "leaderboard_next",
      value: String(currentPage + 1),
    });
  }

  const blocks = [...createLeaderboardBlocks(employees, currentPage, pageSize)];

  if (buttons.length > 0) {
    blocks.push({
      type: "actions",
      elements: buttons,
    });
  }

  return {
    type: "modal",
    title: { type: "plain_text", text: "Leaderboard" },
    blocks: blocks,
  };
};

module.exports = leaderboardView;
