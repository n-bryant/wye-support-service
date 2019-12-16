const constants = require("../constants");
const { STEAM_SPY_CATEGORIES } = constants;

/**
 * validates that a given category is one of the allowed categories
 * @param {String} category
 * @returns {Boolean}
 */
const getIsValidCategory = category => {
  return Object.keys(STEAM_SPY_CATEGORIES).some(
    key => category === STEAM_SPY_CATEGORIES[key].name
  );
};

module.exports = getIsValidCategory;
