import {NextFunction, Request, Response as EResponse} from 'express';
import jwt from 'jsonwebtoken';
import Variables from '@/config/Variables';
import Response from '@/config/Response';
import UserModel from '@/model/UserModel';

class Auth {
    private static verifyToken(token: string, res: EResponse): any {
        try {
            return jwt.verify(token, Variables.SECRET);
        } catch (error) {
            Response.Unauthorized(res, 'Invalid Token');
            return;
        }
    }

    public static authorize() {
        return async (req: Request, res: EResponse, next: NextFunction): Promise<void> => {
            try {
                let token: string | undefined;

                if (req.headers.authorization) {
                    if (req.headers.authorization.startsWith('Bearer ')) {
                        token = req.headers.authorization.replace('Bearer ', '');
                    } else {
                        token = req.headers.authorization;
                    }
                } else {
                    Response.Unauthorized(res, 'No Token Provided');
                    return;
                }

                const decoded = Auth.verifyToken(token, res);
                if (!decoded) return;

                const user = await UserModel.authentication(decoded.id);
                if (!user) {
                    Response.Unauthorized(res, 'User not found');
                    return;
                }

                res.locals.user = user;
                next();
            } catch (error: any) {
                Response.InternalServerError(res, error.message || 'An error occurred');
                return;
            }
        };
    }

    public static generateToken(id: string) {
        return jwt.sign({id}, Variables.SECRET, {expiresIn: '24h'});
    }
}

export default Auth;
