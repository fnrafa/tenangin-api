import {Request, Response as EResponse} from "express";
import multer from "multer";
import crypto from "crypto";
import path, {join} from "path";
import {rename, unlink} from "fs/promises";
import process from "process";
import Variables from "@/config/Variables";
import CustomError from "@/middleware/CustomError";

class Multer {
    private static upload = multer({
        storage: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                const tempPath = join(process.cwd(), Variables.TEMP_PATH);
                cb(null, tempPath);
            },
            filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const uniqueFilename = crypto.randomUUID();
                const ext = path.extname(file.originalname);
                cb(null, `${uniqueFilename}${ext}`);
            }
        }),
        limits: {fileSize: Variables.MAX_FILE_SIZE}
    });

    public static async storeFile(req: Request, res: EResponse, allowedFormats: string[]): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.upload.single("file")(req, res, async (err: any) => {
                if (err) {
                    reject(new CustomError(err.message || "File upload failed"));
                } else if (req.file) {
                    const ext = path.extname(req.file.originalname).toLowerCase();
                    if (!allowedFormats.includes(ext)) {
                        await unlink(req.file.path);
                        reject(new CustomError("Invalid file format", 415));
                        return;
                    }

                    const tempPath = req.file.path;
                    const finalDestination = join(process.cwd(), Variables.STORAGE_PATH, req.file.filename);
                    await rename(tempPath, finalDestination);
                    const fileUrl = `${Variables.BASE_URL}/storage/${req.file.filename}`;
                    resolve(fileUrl);
                } else {
                    resolve(null);
                }
            });
        });
    }

    public static async removeFile(filePath: string): Promise<void> {
        const fullPath = join(process.cwd(), Variables.STORAGE_PATH, filePath);
        try {
            await unlink(fullPath);
        } catch (error : any) {
            if (error.code === "ENOENT") {
                return;
            }
            throw new CustomError(error.message || "Failed to remove file");
        }
    }
}

export default Multer;
