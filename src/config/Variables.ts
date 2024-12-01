import dotenv from "dotenv";
import process from "process";
import CustomError from "@/middleware/CustomError";

class Variables {
    static PORT: number;
    static HOST: string;
    static BASE_URL: string;
    static DATABASE_URL: string;
    static SECRET: string;
    static TIMEOUT: number;
    static TEMP_PATH: string;
    static STORAGE_PATH: string;
    static ALLOWED_ORIGINS: string[];
    static ALLOWED_HEADERS: string;
    static ALLOWED_METHODS: string;
    static RATE_LIMIT_MAX: number;
    static RATE_LIMIT_WINDOW_MS: number;
    static MAX_FILE_SIZE: number;

    static boot(): void {
        dotenv.config();

        this.PORT = this.parseEnvNumber("PORT", true);
        this.HOST = this.validateHost(process.env.HOST || "0.0.0.0");
        this.BASE_URL = process.env.BASE_URL || this.throwError("BASE_URL");
        this.DATABASE_URL = process.env.DATABASE_URL || this.throwError("DATABASE_URL");
        this.SECRET = process.env.SECRET || this.throwError("SECRET");

        this.TIMEOUT = this.parseEnvNumber("TIMEOUT", false, 5000);
        this.TEMP_PATH = process.env.TEMP_PATH || "/public/temp";
        this.STORAGE_PATH = process.env.STORAGE_PATH || "/public/storage";
        this.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["http://localhost:5000"];
        this.ALLOWED_HEADERS = process.env.ALLOWED_HEADERS || "Content-Type,Authorization,Accept";
        this.ALLOWED_METHODS = process.env.ALLOWED_METHODS || "GET,POST,PUT,DELETE";

        this.RATE_LIMIT_WINDOW_MS = this.parseEnvNumber("RATE_LIMIT_WINDOW_MS", false, 60000);
        this.RATE_LIMIT_MAX = this.parseEnvNumber("RATE_LIMIT_MAX", false, 30);
        this.MAX_FILE_SIZE = this.parseEnvNumber("MAX_FILE_SIZE", false, 1048576);
    }

    private static parseEnvNumber(variable: string, required: boolean, defaultValue?: number): number {
        const value = process.env[variable];
        if (!value) {
            if (required) this.throwError(variable);
            return defaultValue as number;
        }
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) throw new CustomError(`Invalid value for ${variable}: must be a number.`);
        return parsed;
    }

    private static validateHost(host: string): string {
        if (host.includes("http://") || host.includes("https://")) {
            throw new CustomError("HOST must not include http:// or https://. Use only the IP address or hostname.");
        }
        return host;
    }

    private static throwError(variable: string): never {
        throw new CustomError(`Missing required environment variable: ${variable}`);
    }
}

export default Variables;
