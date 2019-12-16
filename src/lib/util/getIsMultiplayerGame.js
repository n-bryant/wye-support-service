const constants = require("../constants");
const { MULTIPLAYER_TAGS } = constants;

/**
 * returns whether the provided tags include a multiplayer tag
 * @param {Array} tags - the list of tags to compare against
 */
const getIsMultiplayerGame = (tags = []) =>
  tags.some(tag => MULTIPLAYER_TAGS.includes(tag));

module.exports = getIsMultiplayerGame;
