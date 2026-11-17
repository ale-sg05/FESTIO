import fs from "fs";
import path from "path";
import pino from "pino";
import pinoHttp from "pino-http";

const logDir = process.env.LOG_DIR || path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, "server.log");
const dest = pino.destination({ dest: logFilePath, sync: false });

const logger = pino({ level: process.env.LOG_LEVEL || "info" }, dest);
const httpLogger = pinoHttp({ logger });

export { logger, httpLogger, logFilePath };
