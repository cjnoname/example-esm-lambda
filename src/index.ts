import "reflect-metadata";
import express, { json } from "express";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { globalMiddlewares, orphanedTypes } from "./config/graphql.js";
import { resolvers } from "./config/resolvers.js";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { KnownErrorType } from "./enums/KnownErrorType.js";
import type { IContext } from "./config/context.js";
import {
  createDidEncounterErrors,
  createFormatError,
  generateLocalContext
} from "./config/context.js";
import { dataSource, dbConnect } from "./config/typeorm.js";

const app = express();
app.use(json({ limit: "6mb" }));

const httpServer = http.createServer(app);

await dbConnect();
const schema = await buildSchema({
  resolvers,
  orphanedTypes,
  globalMiddlewares: globalMiddlewares(dataSource),
  container: Container,
  validate: { forbidUnknownValues: false }
});
const server = new ApolloServer<IContext>({
  formatError: createFormatError(KnownErrorType),
  schema,
  allowBatchedHttpRequests: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async requestDidStart() {
        return {
          didEncounterErrors: createDidEncounterErrors(KnownErrorType)
        };
      }
    }
  ]
});

await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  json({ limit: "6mb" }),
  expressMiddleware(server, {
    context: generateLocalContext(dataSource)
  })
);

const port = process.env.PORT ? Number(process.env.PORT) : 8100;
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
