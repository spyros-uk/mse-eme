import * as path from "path";
import { Configuration } from "webpack";
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

export function getHarnessDevConfig(): Configuration {
  const ROOT = path.resolve(__dirname, "..", "..");

  process.env.TS_NODE_PROJECT = path.join(
    path.resolve(__dirname, ".."),
    "typescript",
    "tsconfig.harness.json"
  );

  return {
    mode: "development",
    entry: "./harness/src/index.ts",
    output: {
      // Force webpack to output es5 for its own boilerplate for legacy
      // device compatibility
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        forOf: false,
      },
      libraryTarget: "umd",
      filename: "main.js",
      chunkFilename: "harness.chunk.[name].js",
      chunkLoadingGlobal: "harness_webpackJsonp",
      path: `${ROOT}/harness/dist`,
      clean: true,
    },
    watch: true,
    optimization: {
      chunkIds: "named",
      minimize: false,
      sideEffects: true,
    },
    devtool: "source-map",
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${ROOT}/harness/css/styles.css`,
            to: `${ROOT}/harness/dist/css/[name][ext]`,
          },
          {
            from: `${ROOT}/harness/index.html`,
            to: `${ROOT}/harness/dist/[name][ext]`,
          },
        ],
      }),
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [
        new TsConfigPathsWebpackPlugin({
          logLevel: "INFO",
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|js)?$/,
          exclude: /node_modules/,
          loader: "ts-loader",
          options: {
            configFile: process.env.TS_NODE_PROJECT,
            // Disable type checker during development for faster builds - use `ForkTsCheckerWebpackPlugin` instead.
            // For production builds, full type checking results in a smaller bundle for more accurate tree shaking.
            transpileOnly: true,
          },
        },
      ],
    },
    performance: {
      hints: "warning",
    },
  };
}
