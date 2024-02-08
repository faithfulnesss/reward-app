const errorView = require("../../views/errorView");

module.exports = async (
    client,
    trigger_id,
    errorMessage = "Something went wrong!"
) => {
    await client.views.open({
        trigger_id,
        view: errorView(errorMessage),
    });
};
