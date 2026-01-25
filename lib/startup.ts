import { migrate } from "drizzle-orm/node-postgres/migrator"
import { logger } from "./logger"
import { db } from ".."

let started = false

export default function runStartup() {
  if (started) return
  started = true

  logger.info("Startup runs")
  try {
    migrate(db, { migrationsFolder: "./drizzle/" })
    logger.info("Migration ran succesfully.")
  } catch (error) {
    logger.error("Migration errored", { error })
  }
}
