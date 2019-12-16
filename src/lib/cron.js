const cron = require("node-cron");
const { runCron } = require("./scraper");
const constants = require("./constants");
const { CRON_JOB_SCHEDULE_TIME } = constants;

// kick off a cron job at 3AM each day
cron.schedule(CRON_JOB_SCHEDULE_TIME, () => {
  console.log(`⏲️ Running the cron job...`);
  runCron();
});
