require("dotenv").config({ path: "variables.env" });
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const db = require("./db");

/**
 * Create the Apollo Server
 */
function createServer() {
  return new ApolloServer({
    cors: {
      credentials: true,
      origin: process.env.ORIGIN_URL
    },
    typeDefs,
    resolvers: {
      Mutation,
      Query
    },
    dataSources: () => {
      return {
        db
      };
    }
  });
}

module.exports = createServer;
