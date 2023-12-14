const Award = require("../models/Award");
const { getNotionAwards } = require("../../notion/services/notionService");
// const connectDB = require("../connect");

const createAward = async (award) => {
  try {
    const createdAward = await Award.create(award);
    return createdAward;
  } catch (error) {
    console.error(error);
  }
};

const getAwards = async () => {
  try {
    const awards = await Award.find();
    return awards;
  } catch (error) {
    console.error(error);
  }
};

const getAwardsByCategory = async (category) => {
  try {
    const awards = await Award.find({ Type: category });
    return awards;
  } catch (error) {
    console.error(error);
  }
};

const getAwardByName = async (name) => {
  try {
    const award = await Award.findOne({ Name: name });
    return award;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createAward,
  getAwards,
  getAwardsByCategory,
  getAwardByName,
};
