const getIsSteamTestAppName = name => {
  return /ValveTestApp/.test(name);
};

module.exports = getIsSteamTestAppName;
