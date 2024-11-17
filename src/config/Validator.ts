import Joi, {ObjectSchema} from 'joi';
import {NextFunction, Request, Response as EResponse} from 'express';
import Response from '@/config/Response';

class Validator {
    protected static text = (min: number = 1, max: number = 255) => Joi.string().min(min).max(max);
    protected static uuid = () => Joi.string().guid({version: 'uuidv4'});
    protected static integer = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => Joi.number().integer().min(min).max(max);
    protected static float = (min: number = 0, max?: number) => {
        const schema = Joi.number().min(min);
        return max !== undefined ? schema.max(max) : schema;
    };
    protected static phone = () => Joi.string().min(10).max(15).required().regex(/^\+?[1-9]\d{1,14}$/).messages({'string.pattern.base': 'Phone number must be valid'});
    protected static email = () => Joi.string().email();
    protected static file = () => Joi.any();
    protected static boolean = () => Joi.boolean();
    protected static password = (min: number = 8, max: number = 15) => Joi.string().min(min).max(max);
    protected static repeat = (ref: string) => Joi.string().equal(Joi.ref(ref)).messages({
        'any.only': `${ref}s must match`,
    });
    protected static enum = <T extends string | number | boolean>(allowedValues: T[]) =>
        Joi.string().valid(...allowedValues).default(allowedValues[0]);

    protected static validate(schema: ObjectSchema) {
        return (req: Request, res: EResponse, next: NextFunction): void => {
            const {error} = schema.validate(req.body, {abortEarly: false});

            if (error) {
                const isUnknownKeyError = error.details.some(detail => detail.type === 'object.unknown');
                if (isUnknownKeyError) {
                    Response.BadRequest(res, 'Request contains unexpected fields.');
                    return;
                } else {
                    const errorMessage = error.details.map(err => err.message).join(', ');
                    Response.UnprocessableEntity(res, errorMessage);
                    return
                }
            }

            next();
        };
    }
}

export default Validator;
