const { Prisma } = require("prisma-binding");

// Connect to the remote Prisma DB and provide the ability to query it with JS
const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;
