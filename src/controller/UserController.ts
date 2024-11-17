import {Request, Response as EResponse} from "express";
import Response from "@/config/Response";
import UserModel from "@/model/UserModel";
import bcrypt from "bcrypt";
import CustomError from "@/middleware/CustomError";

class UserController {
    public static async editAccount(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const {name, username, email, character, badge, password, new_password, repeat_new_password} = req.body;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new CustomError('Current password is incorrect', 401);
        const updateData: {
            name?: string;
            username?: string;
            email?: string;
            character?: string;
            badge?: string;
            password?: string;
        } = {name, username, email, character, badge};
        if (new_password) {
            if (new_password !== repeat_new_password) throw new CustomError('New password and repeated password do not match', 422);
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
