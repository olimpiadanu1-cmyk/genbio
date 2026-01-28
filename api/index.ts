import { createApp } from "../server/index.js";

let cachedApp: any = null;

export default async (req: any, res: any) => {
    if (!cachedApp) {
        console.log("[Vercel API] Initializing app...");
        cachedApp = await createApp();
    }

    // Debug log for incoming request
    console.log(`[Vercel API] Request: ${req.method} ${req.url}`);

    try {
        return cachedApp(req, res);
    } catch (error) {
        console.error("[Vercel API] Execution Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: String(error),
            path: req.url
        });
    }
};
