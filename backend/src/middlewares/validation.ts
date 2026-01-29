import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware validation cho request body, query, params
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    next();
  };
};

// Validation schemas
export const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
  }),
};

export const ticketSchemas = {
  update: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Email không hợp lệ',
    }),
    name: Joi.string().min(2).optional().messages({
      'string.min': 'Tên phải có ít nhất 2 ký tự',
    }),
    cccd: Joi.string().min(9).max(12).optional().messages({
      'string.min': 'CCCD phải có ít nhất 9 ký tự',
      'string.max': 'CCCD không được quá 12 ký tự',
    }),
    ticket_code: Joi.string().min(3).optional().messages({
      'string.min': 'Mã vé phải có ít nhất 3 ký tự',
    }),
  }),
};
