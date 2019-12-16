const getHTML = require("./getHTML");
const getCategoryNames = require("./getCategoryNames");

/**
 * retrieves a list of types for a given category
 * @param {Object} category
 * @param {String} selector
 * @param {String} url
 * @returns {Array}
 */
const getCategoryTypeList = async ({ selector, url }) => {
  let categoryTypeList = [];
  const html = await getHTML(url);
  categoryTypeList = await getCategoryNames(html, selector);
  return categoryTypeList;
};

module.exports = getCategoryTypeList;
