const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
await mongoose.connect(process.env.MONGO_URI); 
  await server.start();
  server.applyMiddleware({ app, cors: { origin: 'http://localhost:3000', credentials: true } });
  app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
})();