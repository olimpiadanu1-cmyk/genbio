import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

let initialized = false;
export async function createApp() {
  if (initialized) return app;

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    serveStatic(app);
  } else if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    console.log("[Express] Running on Vercel, static files handled via vercel.json");
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  initialized = true;
  return app;
}

// Only start the server if we're running this file directly (not in Vercel/tests)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  (async () => {
    try {
      await createApp();
      const port = parseInt(process.env.PORT || "5000", 10);
      httpServer.listen(
        {
          port,
          host: "0.0.0.0",
        },
        () => {
          log(`serving on port ${port}`);
        },
      );
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  })();
}

export default app;
