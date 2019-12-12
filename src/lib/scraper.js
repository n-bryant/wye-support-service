const axios = require("axios");
const moment = require("moment");
const get = require("lodash.get");
const { prisma } = require("../generated/js/index");
const sleep = require("./util/sleep");
const { gameReducer } = require("./util/gameReducer");
const constants = require("./constants");
const { STEAM_SPY_BASE_URL, MULTIPLAYER_TAGS, SLEEP_TIME } = constants;

/**
 * retrieves a list of all game IDs from steam spy
 * - note: not using this to get collection as it does not include tag or genre data
 * @returns {Array}
 */
const getGameList = async () => {
  try {
    const response = await axios.get(STEAM_SPY_BASE_URL, {
      params: {
        request: "all"
      }
    });
    const data = get(response, "data", {});
    console.log("Game list retrieved 👍");
    return Object.keys(data);
  } catch (e) {
    console.log("Game list retrieval error: ", e);
    return [];
  }
};

/**
 * retrieves game data from steam spy for a specific game
 * @param {String} gameId - the game id to retrieve data for
 * @returns {Object}
 */
const getGameData = async gameId => {
  let gameData;
  try {
    const response = await axios.get(STEAM_SPY_BASE_URL, {
      params: {
        request: "appdetails",
        appid: gameId
      }
    });
    gameData = get(response, "data", {});
    return Object.keys(gameData).length ? gameReducer(gameData) : gameData;
  } catch (e) {
    console.log("Error reading game: ", gameId);
    console.log(e);
    return {};
  }
};

/**
 * returns whether the provided tags include a multiplayer tag
 * @param {Array} tags - the list of tags to compare against
 */
const getIsMultiplayerGame = tags =>
  tags.some(tag => MULTIPLAYER_TAGS.includes(tag));

/**
 * writes a game's data to prisma db
 * - the upsert method updates a record or creates a new one if the record doesn't exist
 * @param {Object} data - the game data to write
 */
const writeGameData = async data => {
  try {
    await prisma.upsertGame({
      where: {
        appid: data.appid
      },
      update: {
        ...data
      },
      create: {
        ...data
      }
    });
  } catch (e) {
    console.log("Error writing game: ", data.appid);
    console.log(e);
  }
};

/**
 * create new job to retrieve game data from steam spy
 * and create/update records for the data in the db
 */
const runCron = async () => {
  // 1. Create new Job record in db
  let job;
  try {
    job = await prisma.createJob({
      createdTime: moment().format(),
      status: "RUNNING"
    });
    console.log("⏲️ Starting job!");
  } catch (e) {
    console.log("Job start error: ", e);
  }

  // 2. get full game list from steam spy
  const gameList = await getGameList();

  // 3. iterate over game list, collecting game data from steam spy,
  // then write the formatted data to the db
  // - filter out games that are not tagged as multiplayer
  if (gameList.length) {
    console.log("in");
    for (let i = 0; i < gameList.length; i++) {
      // for (let i = 0; i < 5; i++) {
      // ^^^^^^ CHANGE THIS TO ITERATE OVER ALL OF gameList ONCE TESTED ^^^^^^^^

      // set a small timeout to avoid prisma and steam spy rate limits
      if (i % 3 === 0 || i % 5 === 0) {
        await sleep(SLEEP_TIME);
      }

      // retrieve then write data if available
      const gameData = await getGameData(gameList[i]);
      if (Object.keys(gameData).length && gameData.tags) {
        const isMultiplayerGame = getIsMultiplayerGame(
          gameData.tags.split(", ")
        );
        if (isMultiplayerGame) {
          await writeGameData(gameData);
        }
      }
    }
  }

  // 4. write job completion time to db
  if (job && job.id) {
    try {
      await prisma.updateJob({
        data: {
          completedTime: moment().format(),
          status: gameList.length ? "COMPLETE" : "ERROR"
        },
        where: {
          id: job.id
        }
      });
    } catch (e) {
      console.log("Error finishing job", e);
    }
  }
  console.log("🏁 Job completed!");
};

module.exports = {
  runCron,
  getGameList,
  getGameData,
  getIsMultiplayerGame,
  writeGameData
};
