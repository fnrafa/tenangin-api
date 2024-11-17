import {Router} from 'express';
import AuthValidation from "@/validation/AuthValidation";
import AuthController from "@/controller/AuthController";

class AuthRoute {
    private static router = Router();

    public static route(): Router {
        this.router.post('/register', AuthValidation.register(), AuthController.register);
        this.router.post('/login', AuthValidation.login(), AuthController.login);

        return this.router;
    }
}

export default AuthRoute;
