// src/middlewares/ValidationMiddleware.ts
import { AppError } from '@utils/AppError';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateBody<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToInstance(dtoClass, req.body);
            const errors: ValidationError[] = await validate(dto);

            if (errors.length > 0) {
                const messages = errors
                    .map(err => Object.values(err.constraints || {}).join(', '))
                    .join('; ');
                
                throw new AppError(`Validation failed: ${messages}`, 400);
            }

            req.body = dto;
            next();
        } catch (error) {
            next(error);
        }
    };
}
