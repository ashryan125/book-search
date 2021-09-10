const express = require('express');
// apollo server
const { ApolloServer } = require('apollo-server-express');

// typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const path = require('path');

const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// apollo server with schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// apollo server integration with Express
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 API server running on :${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
