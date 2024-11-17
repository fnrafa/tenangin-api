import {Router} from 'express';
import UserController from "@/controller/UserController";
import UserValidation from "@/validation/UserValidation";
import auth from "@/middleware/Auth";

class AuthRoute {
    private static router = Router();

    public static route(): Router {
        this.router.patch('/', auth.authorize(), UserValidation.updateAccount(), UserController.editAccount);
        this.router.delete('/', auth.authorize(), UserValidation.deleteAccount(), UserController.deleteAccount);

        return this.router;
    }
}

export default AuthRoute;
