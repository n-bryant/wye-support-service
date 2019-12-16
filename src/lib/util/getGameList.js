const axios = require("axios");
const get = require("lodash.get");
const constants = require("../constants");
const { STEAM_SPY_BASE_URL } = constants;

/**
 * retrieves a list of all games data from steam spy
 * - note: game tag and genre details are not included from steam spy's all endpoint,
 *   and will be retrieved by utilizing steam spy's tag and genre endpoints
 * @returns {Array}
 */
const getGameList = async () => {
  let gameList = [];
  try {
    const response = await axios.get(STEAM_SPY_BASE_URL, {
      params: {
        request: "all"
      }
    });
    const data = get(response, "data", {});
    gameList = Object.keys(data).map(key => data[key]);
    console.log("Full game list retrieved 👍");
  } catch (e) {
    console.log("Full game list retrieval error: ", e);
  }

  return gameList;
};

module.exports = getGameList;
