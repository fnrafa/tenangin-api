import express from "express";
import http from "http";
import Timeout from "@/middleware/Timeout";
import Limiter from "@/middleware/Limiter";
import Cors from "@/middleware/Cors";
import WebSocket from "@/config/WebSocket";
import Variables from "@/config/Variables";
import AnimationConsole from "@/utils/Console";
import Route from "@/routes/Route";

class Boot {
    private static app = express();
    private static server = http.createServer(this.app);

    public static async boot(): Promise<void> {
        await AnimationConsole.dots('Processing: getting information', new Promise<void>((resolve) => {
            Variables.boot();
            resolve();
        }));
        await AnimationConsole.static('Success: information retrieved');
        await AnimationConsole.dots('Processing: booting', new Promise<void>((resolve) => {
            this.booting();
            resolve();
        }));
        await AnimationConsole.static('Success: booting completed');
        await AnimationConsole.dots(`Starting: trying to run server on port ${Variables.PORT}`, new Promise<void>((resolve) => {
            this.initialize();
            resolve();
        }));
        this.server.listen(Variables.PORT, Variables.HOST, async () => {
            await AnimationConsole.static(`Server is running on http://${Variables.HOST}:${Variables.PORT}\n`);
        });
    }

    private static booting(): void {
        WebSocket.boot(this.server);
        Limiter.boot();
        Timeout.boot();
    }

    private static initialize(): void {
        Cors.applyCors(this.app);
        Limiter.applyRateLimits(this.app);
        Timeout.applyTimeout(this.app);

        Route.registerRoutes(this.app);
    }
}

export default Boot;
