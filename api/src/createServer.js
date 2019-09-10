const { ApolloServer, gql } = require("apollo-server");
const { importSchema } = require("graphql-import");

const db = require("./db");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");

// we use it on order to have ability to use
// forwardTo("db") feature
// see resolvers/Query.js
const typeDefsFile = importSchema(__dirname.concat("/graphql/schema.graphql"));
const typeDefs = gql(typeDefsFile);

// TODO: add cors
const createServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers: {
      Mutation,
      Query
    },
    context: req => ({ ...req, db })
  });
module.exports = createServer;
