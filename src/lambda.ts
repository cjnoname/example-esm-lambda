import "reflect-metadata";
import { Container } from "typedi";
import { globalMiddlewares, orphanedTypes } from "./config/graphql.js";
import { resolvers } from "src/config/resolvers.js";
import { buildSchema } from "type-graphql";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { dataSource } from "./config/typeorm.js";
import { ApolloServer } from "@apollo/server";
import { configure as serverlessExpress } from "@codegenie/serverless-express";
import { KnownErrorType } from "./enums/KnownErrorType.js";
import { json } from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import type express from "express";
import { initialLambda } from "./lambdas/shared.js";
import type { IContext } from "./config/context.js";
import {
  createFormatError,
  generateLambdaContext,
  genericBodyParserOption,
  genericCorsOptions
} from "./config/context.js";
import { generateGenericLambdaExpressApp } from "./config/genericLambda.js";

const createServer = async () => {
  try {
    await initialLambda();
    const server = new ApolloServer<IContext>({
      formatError: createFormatError(KnownErrorType),
      schema: await buildSchema({
        resolvers,
        orphanedTypes,
        globalMiddlewares: globalMiddlewares(dataSource),
        container: Container,
        validate: { forbidUnknownValues: false }
      }),
      allowBatchedHttpRequests: true
    });
    return server;
  } catch (e) {
    throw e;
  }
};

let server: ApolloServer<IContext>;
let app: express.Express;

export const handler = async (event: APIGatewayProxyEventV2, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!server) {
    server = await createServer();
    server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();
    const expressApp = generateGenericLambdaExpressApp(server);
    expressApp.use(
      cors(genericCorsOptions),
      json(genericBodyParserOption),
      expressMiddleware(server, { context: generateLambdaContext(dataSource) })
    );
    app = expressApp;
  }

  return serverlessExpress({ app })(event, context, () => {});
};
