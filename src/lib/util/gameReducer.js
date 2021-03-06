const constants = require("../constants");
const { GAME_IMAGES_BASE_URL } = constants;

/**
 * extracts the min amount of owners from a given owners range string
 * @param {Object} ownersRange
 * @returns {Int}
 */
const getOwnersMin = ownersRange => {
  let min = 0;
  if (ownersRange && typeof ownersRange === "string") {
    const splitRange = ownersRange.split(" .. ");
    if (splitRange.length == 2) {
      const value = splitRange[0];
      if (value) {
        min = parseInt(value.replace(/,/g, ""));
      }
    }
  }
  return min;
};

/**
 * extracts the max amount of owners from a given owners range string
 * @param {Object} ownersRange
 * @returns {Int}
 */
const getOwnersMax = ownersRange => {
  let max = 0;
  if (ownersRange && typeof ownersRange === "string") {
    const splitRange = ownersRange.split(" .. ");
    if (splitRange.length == 2) {
      const value = ownersRange.split(" .. ")[1];
      if (value) {
        max = parseInt(value.replace(/,/g, ""));
      }
    }
  }
  return max;
};

/**
 * computes the user rating percentage for a game
 * @param {Int} positive - the number of positive ratings
 * @param {Int} negative - the number of negative ratings
 * @returns {Int}
 */
const getUserRatingPercentage = (positive, negative) => {
  const total = positive + negative;
  return Math.round((positive * 100) / total);
};

/**
 * transforms a game received from steam spy's appdetails endpoint
 * into a game object that matches the schema
 * @param {Object} game - game data from steam spy's appdetails endpoint
 * @returns {Object}
 */
const gameReducer = game => {
  return {
    appid: game.appid.toString(),
    name: game.name,
    developers: game.developer,
    publishers: game.publisher,
    genres: game.genres.join(", "),
    tags: game.tags.join(", "),
    freeToPlay: game.price === "0",
    onSale: game.discount !== "0",
    discount: parseInt(game.discount, 10),
    initialPrice: parseInt(game.initialprice, 10),
    finalPrice: parseInt(game.price, 10),
    userRating: getUserRatingPercentage(game.positive, game.negative),
    playtime2Weeks: game.average_2weeks,
    playtimeForever: game.average_forever,
    ownersFormatted: game.owners ? game.owners : "n/a",
    ownersMin: getOwnersMin(game.owners),
    ownersMax: getOwnersMax(game.owners),
    headerImage: `${GAME_IMAGES_BASE_URL}${game["appid"]}/header.jpg`,
    backgroundImage: `${GAME_IMAGES_BASE_URL}${game["appid"]}/page_bg_generated_v6b.jpg`,
    broadcastLeftImage: `${GAME_IMAGES_BASE_URL}${game["appid"]}/broadcast_left_panel.jpg`,
    broadcastRightImage: `${GAME_IMAGES_BASE_URL}${game["appid"]}/broadcast_right_panel.jpg`,
    capsuleSm: `${GAME_IMAGES_BASE_URL}${game["appid"]}/capsule_231x87.jpg`,
    capsuleMd: `${GAME_IMAGES_BASE_URL}${game["appid"]}/capsule_467x181.jpg`,
    capsuleLg: `${GAME_IMAGES_BASE_URL}${game["appid"]}/capsule_616x353.jpg`,
    logo: `${GAME_IMAGES_BASE_URL}${game["appid"]}/logo.png`,
    libraryCapsule: `${GAME_IMAGES_BASE_URL}${game["appid"]}/library_600x900.jpg`,
    libraryHero: `${GAME_IMAGES_BASE_URL}${game["appid"]}/library_hero.jpg`
  };
};

module.exports = {
  gameReducer,
  getUserRatingPercentage,
  getOwnersMin,
  getOwnersMax
};
