import app, { createApp } from "../server/index";

export default async (req: any, res: any) => {
    await createApp();
    return app(req, res);
};
