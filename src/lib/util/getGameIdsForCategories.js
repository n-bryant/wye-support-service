const axios = require("axios");
const get = require("lodash.get");

const sleep = require("./sleep");
const getIsValidCategory = require("./getIsValidCategory");

const constants = require("../constants");
const { STEAM_SPY_BASE_URL, STEAM_SPY_CATEGORIES, SLEEP_TIME } = constants;

/**
 * sorts a category list by owner count, user rating, and time played
 * @param {Object} list
 * @returns {Array}
 */
const getRankedCategoryGames = list => {
  // handle empty list
  if (!Object.keys(list).length) {
    return [];
  }

  // build list of unsorted items and compute owner count and user rating to sort by
  const unsortedList = Object.keys(list).map(key => ({
    ...list[key],
    ownersMax: list[key].owners.split(" .. ")[1]
      ? parseInt(list[key].owners.split(" .. ")[1].replace(/,/g, ""))
      : 0,
    userRating: Math.round(
      (list[key].positive * 100) / (list[key].positive + list[key].negative)
    )
  }));

  // sorting by owner count, user rating, and average playtime
  const sortBy = [
    {
      prop: "ownersMax",
      direction: -1
    },
    {
      prop: "userRating",
      direction: -1
    },
    {
      prop: "average_forever",
      direction: -1
    }
  ];

  const sortedList = unsortedList.sort((a, b) => {
    let i = 0,
      result = 0;
    while (i < sortBy.length && result === 0) {
      result =
        sortBy[i].direction *
        (get(a, sortBy[i].prop) < get(b, sortBy[i].prop)
          ? -1
          : get(a, sortBy[i].prop) > get(b, sortBy[i].prop)
          ? 1
          : 0);
      i++;
    }
    return result;
  });
  return sortedList;
};

/**
 * retrieves game ID for each of the given category types
 * @param {String} category
 * @param {Array} types
 * @returns {Object}
 */
const getGameIdsForCategories = async (
  category = STEAM_SPY_CATEGORIES.TAG.name,
  types
) => {
  let gameCategories = {};
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

      gameCategories[types[i]] = getRankedCategoryGames(data).map(item =>
        item.appid.toString()
      );
    }
  }

  return gameCategories;
};

module.exports = { getGameIdsForCategories, getRankedCategoryGames };
