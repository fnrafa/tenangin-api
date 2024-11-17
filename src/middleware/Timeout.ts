import {Application, NextFunction, Request, Response as EResponse} from 'express';
import Response from "@/config/Response";
import Variables from "@/config/Variables";

class Timeout {
    static timeoutDuration: number;

    static boot(): void {
        this.timeoutDuration = Variables.TIMEOUT;
    }

    static middleware = (req: Request, res: EResponse, next: NextFunction): void => {
        const timer = setTimeout(() => {
            Response.RequestTimeout(res);
        }, this.timeoutDuration);

        res.on('finish', () => {
            clearTimeout(timer);
        });

        next();
    }

    static applyTimeout(app: Application): void {
        app.use(this.middleware);
    }
}

export default Timeout;
