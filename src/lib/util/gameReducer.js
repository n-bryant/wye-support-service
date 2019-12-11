const constants = require("../constants");
const { GAME_IMAGES_BASE_URL } = constants;

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
    genres: game.genre,
    tags: Object.keys(game.tags).join(", "),
    freeToPlay: game.price === "0",
    onSale: game.discount !== "0",
    discount: parseInt(game.discount, 10),
    initialPrice: parseInt(game.initialprice, 10),
    finalPrice: parseInt(game.price, 10),
    userRating: getUserRatingPercentage(game.positive, game.negative),
    heroImageUrl: `${GAME_IMAGES_BASE_URL}${game["appid"]}/library_hero.jpg`,
    logoImageUrl: `${GAME_IMAGES_BASE_URL}${game["appid"]}/logo.png`
  };
};

module.exports = { gameReducer, getUserRatingPercentage };
