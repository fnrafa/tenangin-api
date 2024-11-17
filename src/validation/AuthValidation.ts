import Joi from 'joi';
import Validator from "@/config/Validator";

class AuthValidation extends Validator {
    public static register() {
        return this.validate(
            Joi.object({
                name: this.text().required(),
                username: this.text(4, 16).required(),
                email: this.email().required(),
                password: this.password().required(),
                repeat_password: this.repeat('password').required(),
            })
        );
    }

    public static login() {
        return this.validate(
            Joi.object({
                username: this.text(4, 16).required(),
                password: this.password().required(),
            })
        );
    }
}

export default AuthValidation;
