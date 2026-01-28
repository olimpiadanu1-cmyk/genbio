import app, { createApp } from "../server/index";

export default async (req: any, res: any) => {
    console.log(`[Vercel API] Request: ${req.method} ${req.url}`);
    try {
        await createApp();
        return app(req, res);
    } catch (error) {
        console.error("[Vercel API] Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: String(error) });
    }
};
