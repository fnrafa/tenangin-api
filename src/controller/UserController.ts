import {Request, Response as EResponse} from "express";
import Response from "@/config/Response";
import UserModel from "@/model/UserModel";
import bcrypt from "bcrypt";
import CustomError from "@/middleware/CustomError";
import Multer from "@/config/Multer";

class UserController {
    public static async updateProfilePicture(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const allowedFormats = [".jpg", ".jpeg", ".png", ".svg"];
        const newImageUrl = await Multer.storeFile(req, res, allowedFormats);
        if (user.url) {
            const oldFilePath = user.url.split("/").pop();
            if (oldFilePath) {
                await Multer.removeFile(oldFilePath);
            }
        }

        const updatedUser = await UserModel.editAccount(user.id, {
            url: newImageUrl || null,
        });

        Response.Success(res, "Profile updated successfully", updatedUser);
    }

    public static async editAccount(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const {name, username, email, badge, password, new_password} = req.body;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new CustomError('Current password is incorrect', 401);
        const updateData: {
            name?: string;
            username?: string;
            email?: string;
            badge?: string;
            password?: string;
        } = {name, username, email, badge};
        if (new_password) {
            updateData.password = await bcrypt.hash(new_password, 10);
        }
        const updatedUser = await UserModel.editAccount(user.id, updateData);
        Response.Success(res, "Profile updated successfully", updatedUser);
    }

    public static async deleteAccount(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const {password} = req.body;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new CustomError('Current password is incorrect', 401);
        await UserModel.deleteAccount(user.id);
        Response.NoContent(res);
    }
}

export default UserController;
