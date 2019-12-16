/**
 * retrieves category types for a given game by game ID
 * @param {String} appid
 * @param {Object} typeList
 * @returns {Array}
 */
const getCategoryTypesForGame = (appid, typeList = {}) => {
  let types = [];
  const keys = Object.keys(typeList);

  // add any types that have matches for the given appid
  for (let i = 0; i < keys.length; i++) {
    if (typeList[keys[i]].some(game => (game.appid = appid))) {
      types.push(keys[i]);
    }
  }

  return types;
};

module.exports = getCategoryTypesForGame;
