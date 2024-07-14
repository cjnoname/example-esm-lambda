import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
// import { sentryWebpackPlugin } from "@sentry/webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: "production",
  experiments: {
    outputModule: true
  },
  output: {
    chunkFormat: "module",
    chunkLoading: "import",
    library: {
      type: "module"
    }
  },
  entry: "src/index.ts",
  externals: ["aws-sdk"],
  target: "node",
  // devtool: slsw.lib.webpack.isLocal ? "source-map" : undefined,
  resolve: {
    extensions: [".ts", ".js"],
    // extensionAlias: {
    //   ".js": [".ts", ".js"]
    // },
    alias: {
      src: resolve(__dirname, "src")
    },
    tsConfig: {
      configFile: "./tsconfig.json"
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          module: {
            type: "es6",
            strict: true,
            noInterop: false
          },
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
              tsx: false
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true
              // decoratorVersion: "2022-03"
            }
          }
        },
        type: "javascript/esm"
      }
    ]
  },
  plugins: []
};
// if (process.env.STAGE && !slsw.lib.webpack.isLocal) {
//   config.plugins
//     .push
//     // sentryWebpackPlugin({
//     //   org: process.env.SENTRY_ORG,
//     //   project: process.env.PROJECT_NAME,
//     //   authToken: process.env.SENTRY_AUTH_TOKEN,
//     //   telemetry: false,
//     //   release: {
//     //     deploy: {
//     //       env: process.env.STAGE.toUpperCase()
//     //     }
//     //   }
//     // })
//     ();
