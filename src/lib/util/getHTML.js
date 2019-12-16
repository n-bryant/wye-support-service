const axios = require("axios");
const get = require("lodash.get");

/**
 * retrieves the html of a specified url
 * @param {String} url
 * @returns {String}
 */
const getHTML = async url => {
  const response = await axios.get(url);
  return get(response, ["data", "html"], "");
};

module.exports = getHTML;
