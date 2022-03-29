import * as path from "path"
import * as yargs from "yargs"
import { Configuration, webpack } from "webpack"
import { getPlayerDevConfig } from "../config/webpack/player.dev.config"
import { getHarnessDevConfig } from "../config/webpack/harness.dev.config"

const argv = yargs
  .option("build", {
    type: "string",
    description: "The type of artifact to be built",
    choices: ["PLAYER", "HARNESS"],
    default: "HARNESS",
  })
  .parseSync()

const config: Configuration =
  argv.build === "PLAYER" ? getPlayerDevConfig() : getHarnessDevConfig()

webpack(config, (err, stats) => {
  if (err || stats?.hasErrors()) {
    const error = err ?? stats?.compilation.errors[0]
    console.error("Build failed: ", error?.message)
    return process.exit(1)
  }

  const time = stats?.toJson().time
  console.debug("Build completed")
  console.debug(`Created: ${new Date().toLocaleString()}`)
  if (time) console.debug(`Duration: ${time / 1000}s`)
})
