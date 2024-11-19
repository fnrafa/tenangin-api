import Joi from 'joi';
import Validator from "@/config/Validator";

class UserValidation extends Validator {
    public static updateProfilePicture() {
        return this.validate(
            Joi.object({
                image: this.file().optional(),
            })
        );
    }

    public static updateAccount() {
        return this.validate(
            Joi.object({
                name: this.text().optional(),
                username: this.text(4, 16).optional(),
                email: this.email().optional(),
                badge: this.text().optional(),
                password: this.password().required(),
                new_password: this.password().optional(),
                repeat_new_password: this.repeat('new_password').when("new_password", {
                    is: Joi.exist(),
                    then: Joi.required(),
                    otherwise: Joi.optional(),
                }),
            })
        );
    }

    public static deleteAccount() {
        return this.validate(
            Joi.object({
                password: this.password().required(),
            })
        );
    }
}

export default UserValidation;
