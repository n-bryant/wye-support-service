const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });
const { prisma } = require("./generated/js/index.js");
const constants = require("./lib/constants");
const { ERRORS } = constants;

const app = express();

// set cors policy
app.use(cors({ origin: process.env.ORIGIN_URL }));
// parse the request body as JSON.
app.use(express.json());

// endpoint to provide games data
app.post("/games", async (req, res, next) => {
  const { gameids, filters = {}, first, after, orderBy } = req.body;

  let games = [];
  const config = {
    where: {
      appid_in: gameids && gameids.length ? gameids : undefined,
      ...filters
    },
    first,
    after,
    orderBy
  };

  try {
    games = await prisma.games(config);
    res.json({ games });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
    next();
  }
});

module.exports = app;
