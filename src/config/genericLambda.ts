import type { ApolloServer } from "@apollo/server";
import compression from "compression";
import express from "express";

let genericLambdaExpressApp: express.Express;

export const generateGenericLambdaExpressApp = (server: ApolloServer<any>) => {
  if (!genericLambdaExpressApp) {
    const app = express();

    app.use(compression());

    app.get("/500", (req, res) => {
      res.json({
        errors: [
          {
            message: "aaaa",
            extensions: { code: 123 }
          }
        ]
      });
    });

    app.get("/504", (req, res) => {
      res.json({
        errors: [
          {
            message: "BBB",
            extensions: { code: 456 }
          }
        ]
      });
    });

    genericLambdaExpressApp = app;
  }

  return genericLambdaExpressApp;
};
