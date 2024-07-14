import type { DataSource } from "typeorm";
import type { CorsOptions } from "cors";
import type { OptionsJson } from "body-parser";
import type { ContextFunction, GraphQLRequestContextDidEncounterErrors } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import type { GraphQLError, GraphQLFormattedError } from "graphql";
import type { AdminUser } from "src/modules/User/Models/User.js";

interface IEventBodyType {
  operationName: string;
  variables: any;
  query: string;
}

export interface IContext {
  user?: AdminUser | null;
  uid?: string;
  email?: string;
  country?: string;
  state?: string;
  city?: string;
  sourceIp?: string;
  userAgent?: string;
  startTime: Date;
  eventBody?: IEventBodyType;
  apiVersion?: string;
}

export type EnhancedGraphqlError = GraphQLError & {
  originalError?: {
    extensions?: GraphQLError["extensions"] & { extraErrorMessages: any };
  };
};

export const createFormatError = (KnownErrorType: { [key: string]: string }) => {
  const mergedKnownErrors = [...Object.values(KnownErrorType)];
  return (formattedError: GraphQLFormattedError, _error: unknown) => {
    const error = <GraphQLError>_error;
    const { originalError } = error;

    if (
      typeof originalError?.name === "string" &&
      !mergedKnownErrors.includes(originalError.name)
    ) {
      return {
        message: "System error",
        extensions: { code: "SYSTEM_ERROR" }
      };
    }

    return {
      message: formattedError.message,
      extensions: {
        code: formattedError.extensions?.code,
        extraErrorMessages: formattedError.extensions?.extraErrorMessages
      }
    };
  };
};

export const createDidEncounterErrors = (KnownErrorType: { [key: string]: string }) => {
  const mergedKnownErrors = [...Object.values(KnownErrorType)];

  return async ({ errors, contextValue }: GraphQLRequestContextDidEncounterErrors<any>) => {
    for await (const error of errors) {
      const isUnknownError =
        !error.originalError?.name || !mergedKnownErrors.includes(error.originalError?.name);
      const apiVersionMismatched =
        (error.extensions?.http as any)?.status === 400 &&
        error.extensions?.code === "GRAPHQL_VALIDATION_FAILED" &&
        !!contextValue.apiVersion &&
        !!process.env.API_VERSION &&
        process.env.API_VERSION !== contextValue.apiVersion;
      if (isUnknownError && !apiVersionMismatched) {
      }
    }
  };
};

export const generateLocalContext: (
  dataSource: DataSource
) => ContextFunction<[ExpressContextFunctionArgument], IContext> =
  (dataSource) =>
  async ({ req }) => {
    const startTime = new Date();
    const authToken = req.headers.authorization;
    if (!authToken) {
      return { req, startTime } as IContext;
    }
    const context: IContext = {
      startTime
    };
    return context;
  };

export const generateLambdaContext: (
  dataSource: DataSource
) => ContextFunction<[ExpressContextFunctionArgument], IContext> =
  (dataSource) =>
  async ({ req }) => {
    try {
      const startTime = new Date();
      const sourceIp = req.ip ?? "";
      const userAgent = req.headers["user-agent"] ?? "";
      const authToken = req.headers["authorization"];
      const country = req.headers["cloudfront-viewer-country"]?.toString();
      const state = req.headers["cloudfront-viewer-country-region"]?.toString();
      const city = req.headers["cloudfront-viewer-city"]?.toString();
      if (!authToken) {
        return {
          sourceIp,
          country,
          state,
          city,
          userAgent,
          startTime
        } as IContext;
      }
      return {
        sourceIp,
        country,
        state,
        city,
        userAgent,
        startTime
      } as IContext;
    } catch (e) {
      throw e;
    }
  };

export const genericCorsOptions: CorsOptions = {
  allowedHeaders: [
    "Content-Type",
    "X-Amz-Date",
    "Authorization",
    "X-Api-Key",
    "X-Amz-Security-Token",
    "X-Amz-User-Agent"
  ],
  methods: ["POST", "GET", "OPTIONS"]
};

export const genericBodyParserOption: OptionsJson = {
  limit: "6mb"
};
