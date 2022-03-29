import * as path from "path"
import { Configuration } from "webpack"
import TsConfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin"

export function getPlayerDevConfig(): Configuration {
  const ROOT = path.resolve(__dirname, "..", "..")

  process.env.TS_NODE_PROJECT = path.join(
    path.resolve(__dirname, ".."),
    "typescript",
    "tsconfig.player.json"
  )

  return {
    mode: "development",
    entry: "./src/index.ts",
    output: {
      // Force webpack to output es5 for its own boilerplate for legacy
      // device compatibility
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        forOf: false,
      },
      libraryTarget: "system",
      filename: "player.js",
      chunkFilename: "player.chunk.[name].js",
      chunkLoadingGlobal: "player_webpackJsonp",
      path: `${ROOT}/dist`,
      clean: true,
    },
    watch: false,
    optimization: {
      chunkIds: "named",
      minimize: false,
      sideEffects: true,
    },
    devtool: "source-map",
    plugins: [],
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
  }
}
