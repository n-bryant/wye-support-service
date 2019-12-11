const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });
const { prisma } = require("./generated/js/index.js");
const { runCron } = require("./lib/scraper");

const app = express();
app.use(cors({ origin: process.env.ORIGIN_URL }));

// endpoint to provide games data
app.get("/games", async (req, res, next) => {
  const { gameids } = req.query;
  console.log(gameids);
  let games = [];
  try {
    games = await prisma.games({
      where: {
        appid_in: gameids.split(",")
      }
    });
  } catch (e) {
    console.log(e);
  }
  res.json({ games });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port: ${process.env.PORT}`);
  go();
});

const go = async () => {
  // runCron();
};
