import {Request, Response as EResponse} from 'express';
import {compare} from 'bcryptjs';
import Response from '@/config/Response';
import Auth from "@/middleware/Auth";
import UserModel from "@/model/UserModel";
import CustomError from "@/middleware/CustomError";

class AuthController {
    public static async register(req: Request, res: EResponse): Promise<void> {
        const {email, username, name, password} = req.body;
        const user = await UserModel.createUser(email, username, password, name);
        const token = Auth.generateToken(user.id);
        Response.Created(res, 'User created successfully', {
            user,
            token,
        });
    }

    public static async login(req: Request, res: EResponse): Promise<void> {
        const {username, password} = req.body;
        const user = await UserModel.getUserByUsername(username);
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) throw new CustomError('Wrong Password', 401);
        const token = Auth.generateToken(user.id);
        Response.Success(res, 'Authenticated successfully', {
            user,
            token,
        });
    }
}

export default AuthController;
