const axios = require("axios");
const get = require("lodash.get");

const sleep = require("./sleep");
const getIsValidCategory = require("./getIsValidCategory");

const constants = require("../constants");
const { STEAM_SPY_BASE_URL, STEAM_SPY_CATEGORIES, SLEEP_TIME } = constants;

/**
 * retrieves games data for a given category
 * @param {String} category
 * @param {Array} types
 * @returns {Object}
 */
const getGameIdsForCategory = async (
  category = STEAM_SPY_CATEGORIES.TAG.name,
  types
) => {
  let gameIdsForCategory = {};
  // only try to retrieve data for the tag or genre category
  if (getIsValidCategory(category) && types && types.length) {
    for (let i = 0; i < types.length; i++) {
      // set a small timeout to avoid steam spy rate limits
      if (i % 3 === 0) {
        await sleep(SLEEP_TIME);
      }

      // get type data
      let data = {};
      try {
        const response = await axios.get(STEAM_SPY_BASE_URL, {
          params: {
            request: category,
            [category]: types[i]
          }
        });
        data = get(response, "data", {});
        console.log(
          `Game IDs retrieved for ${category}: ${types[i]} (${i + 1} of ${
            types.length
          })`
        );
      } catch (e) {
        console.log(
          `Game IDs retrieval error for the ${types[i]} ${category}: `,
          e
        );
      }

      gameIdsForCategory[types[i]] = Object.keys(data);
    }
  }

  return gameIdsForCategory;
};

module.exports = getGameIdsForCategory;
