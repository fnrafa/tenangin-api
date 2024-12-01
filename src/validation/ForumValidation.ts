import Joi from 'joi';
import Validator from "@/config/Validator";

class ForumValidation extends Validator {
    public static postForum() {
        return this.validate(
            Joi.object({
                text: this.text(),
                file: this.file().optional(),
                anonymous: Joi.boolean().optional(),
            })
        );
    }

    public static likeForum() {
        return this.validate(
            Joi.object({
                storyId: this.uuid().required(),
            })
        );
    }

    public static commentForum() {
        return this.validate(
            Joi.object({
                storyId: this.uuid().required(),
                text: this.text().required(),
            })
        );
    }

    public static likeCommentForum() {
        return this.validate(
            Joi.object({
                commentId: this.uuid().required(),
            })
        );
    }
}

export default ForumValidation;
