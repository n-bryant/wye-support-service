const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });
const { prisma } = require("./generated/js/index.js");

const app = express();
app.use(cors({ origin: process.env.ORIGIN_URL }));

// endpoint to provide games data
app.get("/games", async (req, res, next) => {
  const { gameids } = req.query;
  let games = [];
  if (gameids && typeof gameids === "string" && gameids.length) {
    try {
      games = await prisma.games({
        where: {
          appid_in: gameids.split(",")
        }
      });
      res.json({ games });
    } catch (e) {
      console.log(e);
      res.json({ error: e });
      next();
    }
  } else {
    res.json({ error: "NO_GAMES" });
  }
});

module.exports = app;
