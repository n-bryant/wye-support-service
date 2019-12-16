const { prisma } = require("../../generated/js/index");
const moment = require("moment");

/**
 * create a new Job in the db
 * @returns {Object}
 */
const createJob = async () => {
  let job = {};
  try {
    job = await prisma.createJob({
      createdTime: moment().format(),
      status: "RUNNING"
    });
    console.log("⏲️ Starting job!");
  } catch (e) {
    console.log("Job start error: ", e);
  }
  return job;
};

module.exports = createJob;
