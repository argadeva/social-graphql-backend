const express = require('express');
const { createServer } = require("http");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { ApolloServer } = require("apollo-server-express");

const mongoose = require('mongoose');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/resolvers');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 5000;

const main = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  const httpServer = createServer(app);
  
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  app.get("/", function (req, res) {
    res.send("WORKING!!!");
  });
  
  const serverCleanup = useServer({ schema }, wsServer);
  
  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    context: ({ req }) => ({ req }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`,
    );
  });
};

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    main();
  })
  .catch(err => {
    console.error(err)
  });