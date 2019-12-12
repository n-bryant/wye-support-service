const app = require("./app");
require("dotenv").config({ path: "variables.env" });
const { runCron } = require("./lib/scraper");

// start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port: ${process.env.PORT}`);
  go();
});

const go = async () => {
  // runCron();
};
