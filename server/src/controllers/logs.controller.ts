import type { Request, Response } from "express";
import fs from "fs";
import { logger, logFilePath } from "../lib/logger";

const redactLine = (line: string): string => {
  // Mask long digit sequences (likely card numbers)
  let out = line.replace(/\b\d{12,19}\b/g, (m) => "****");
  // Partially mask emails: alice@example.com -> a***@example.com
  out = out.replace(
    /([A-Za-z0-9._%+-])([A-Za-z0-9._%+-]*?)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
    (_, f, _m, d) => {
      return `${f}***@${d}`;
    },
  );
  return out;
};

const getLogs = async (req: Request, res: Response) => {
  try {
    const linesQuery = Array.isArray(req.query.lines)
      ? req.query.lines[0]
      : (req.query.lines as string | undefined);
    const lines = Math.min(Math.max(Number(linesQuery) || 200, 1), 2000);

    if (!fs.existsSync(logFilePath)) {
      return res.json({ data: [] });
    }

    const data = await fs.promises.readFile(logFilePath, "utf-8");
    const allLines = data.split(/\r?\n/).filter(Boolean);
    const tail = allLines.slice(-lines).map(redactLine);

    logger.info(
      { user: (req.user as any)?.role || "unknown", lines: tail.length },
      "admin requested logs",
    );

    return res.json({ data: tail });
  } catch (error) {
    logger.error({ err: error }, "Failed to read logs");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logsController = {
  getLogs,
};
