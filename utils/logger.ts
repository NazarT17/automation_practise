import winston from "winston";
import path from "path";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Error logs in separate file
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    // All logs in combined file
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),
    // Console output with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;
