import Model from "@/model/Model";
import {User} from "@prisma/client";
import bcrypt from "bcrypt";

class UserModel extends Model {
    public static async getAllUser(): Promise<User[]> {
        try {
            return await this.prisma.user.findMany({
                where: {deletedAt: null},
            });
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    public static async authentication(id: string): Promise<User> {
        try {
            return await this.prisma.user.findFirstOrThrow({
                where: {id, deletedAt: null},
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async createUser(email: string, username: string, password: string, name: string): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await this.prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    name,
                    character : "default",
                },
            });
        } catch (error: any) {
            if (error.code === "P2002") {
                throw new Error("Email or username already exists.");
            }
            this.handleError(error);
            throw error;
        }
    }


    public static async getUserByUsername(username: string): Promise<User> {
        try {
            return await this.prisma.user.findFirstOrThrow({
                where: {username, deletedAt: null},
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
}

export default UserModel;