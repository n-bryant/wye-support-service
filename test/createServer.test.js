const createServer = require("../src/createServer");
const typeDefs = require("../src/schema");
const Mutation = require("../src/resolvers/Mutation");
const Query = require("../src/resolvers/Query");
const db = require("../src/db");

jest.mock("../src/db", () => jest.fn());

describe("createServer", () => {
  it("should return a new instance of an ApolloServer", () => {
    expect(createServer().constructor.name).toBe("ApolloServer");
  });

  it("should set a cors policy on the returned ApolloServer based on the environment ORIGIN_URL variable", () => {
    process.env.ORIGIN_URL = "foo";
    expect(createServer().config.cors.credentials).toBeTruthy();
    expect(createServer().config.cors.origin).toBe(process.env.ORIGIN_URL);
  });

  it("should set typeDefs matching the provided schema", () => {
    expect(createServer().config.typeDefs).toMatchObject(typeDefs);
  });

  it("should set resolvers matching Query and Mutation", () => {
    expect(createServer().config.resolvers).toMatchObject({
      Mutation,
      Query
    });
  });

  it("should set dataSources as a function that returns an object containing db", () => {
    expect(createServer().config.dataSources().db).toBe(db);
  });
});
