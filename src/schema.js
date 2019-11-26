const { gql } = require("apollo-server");

const typeDefs = gql`
  type Mutation {
    placeholder: String
  }

  type Query {
    placeholder: String
  }
`;

module.exports = typeDefs;
