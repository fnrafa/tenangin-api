import Joi from 'joi';
import Validator from "@/config/Validator";

class AuthValidation extends Validator {
    public static register() {
        return this.validate(
            Joi.object({
                name: this.text(),
                username: this.text(4, 16),
                email: this.email(),
                password: this.password(),
                repeat_password: this.repeat('password'),
            })
        );
    }

    public static login() {
        return this.validate(
            Joi.object({
                username: this.text(4, 16),
                password: this.password(),
            })
        );
    }
}

export default AuthValidation;
