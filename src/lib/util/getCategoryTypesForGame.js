/**
 * retrieves category types for a given game by game ID
 * @param {String} appid
 * @param {Object} typeList
 * @returns {Array}
 */
const getCategoryTypesForGame = (appid, typeList = {}) => {
  let gameTypes = [];
  const availableTypes = Object.keys(typeList);

  // add any types that have matches for the given appid
  for (let i = 0; i < availableTypes.length; i++) {
    if (typeList[availableTypes[i]].some(gameId => gameId === appid)) {
      gameTypes.push(availableTypes[i]);
    }
  }

  return gameTypes;
};

module.exports = getCategoryTypesForGame;
