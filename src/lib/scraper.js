const createJob = require("./util/createJob");
const completeJob = require("./util/completeJob");
const writeGameData = require("./util/writeGameData");
const getGameList = require("./util/getGameList");
const getCategoryTypeList = require("./util/getCategoryTypeList");
const getGameIdsForCategory = require("./util/getGameIdsForCategory");
const getCategoryTypesForGame = require("./util/getCategoryTypesForGame");
const getIsMultiplayerGame = require("./util/getIsMultiplayerGame");
const getIsSteamTestAppName = require("./util/getIsSteamTestAppName");
const { gameReducer } = require("./util/gameReducer");
const sleep = require("./util/sleep");

const constants = require("./constants");
const { STEAM_SPY_CATEGORIES, SLEEP_TIME, ERRORS } = constants;

const moment = require("moment");

/**
 * create new job to retrieve game data from steam spy
 * and create/update records for the data in the db
 */
const runCron = async () => {
  let errors = [];

  // start job
  const job = await createJob();
  const startTime = Date.now();
  console.log(`Starting job at: ${moment().format()}`);

  // collect all games data
  // - unfortunately, steam spy's all endpoint doesn't include tag/genre details
  let games = await getGameList();
  if (games.length) {
    // collect game IDs from each tag endpoint
    const tagList = await getCategoryTypeList(STEAM_SPY_CATEGORIES.TAG);
    const gameIdsByTag = await getGameIdsForCategory(
      STEAM_SPY_CATEGORIES.TAG.name,
      tagList
    );

    // collect game IDs from each genre endpoint
    const genreList = await getCategoryTypeList(STEAM_SPY_CATEGORIES.GENRE);
    const gameIdsByGenre = await getGameIdsForCategory(
      STEAM_SPY_CATEGORIES.GENRE.name,
      genreList
    );

    // build out tag/genre data for games
    let multiplayerGameCount = 0;
    for (let i = 0; i < games.length; i++) {
      // set errors if no genres or tags were scraped
      if (!gameIdsByTag || !Object.keys(gameIdsByTag).length) {
        errors.push(ERRORS.NO_TAGS_FOUND);
        break;
      } else if (!gameIdsByGenre || !Object.keys(gameIdsByGenre).length) {
        errors.push(ERRORS.NO_GENRES_FOUND);
        break;
      }

      if (games[i] && games[i].appid) {
        // add tags to game record
        games[i].tags = getCategoryTypesForGame(
          games[i].appid.toString(),
          gameIdsByTag
        );

        // add genres to game record
        games[i].genres = getCategoryTypesForGame(
          games[i].appid.toString(),
          gameIdsByGenre
        );

        // write game to db if it's a multiplayer game
        if (
          getIsMultiplayerGame(games[i].tags) &&
          !getIsSteamTestAppName(games[i].name)
        ) {
          // small timeout to avoid prisma rate limit
          if (i % 9 === 0) {
            await sleep(SLEEP_TIME);
          }
          // write game to db
          await writeGameData(gameReducer(games[i]));
          multiplayerGameCount++;
        }
      }
    }
    console.log(
      `Finished in ${(Date.now() - startTime) / 1000 / 60} minute(s)!`
    );
    console.log(
      `Wrote ${multiplayerGameCount} game${
        multiplayerGameCount !== 1 ? "s" : ""
      } to the db`
    );
  } else {
    errors.push(ERRORS.NO_GAMES_FOUND);
  }

  // finish job
  if (job && job.id) {
    await completeJob(job.id, errors);
  }
  console.log("🏁 Job completed!");
};

module.exports = {
  runCron
};
