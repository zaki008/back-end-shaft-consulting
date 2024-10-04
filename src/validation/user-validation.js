import Joi from "joi";

export const registerUserValidation = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
});

export const loginUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

export const searchUserValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
  username: Joi.string().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
});

export const updateUserValidation = Joi.object({
  first_name: Joi.string().max(100).optional(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().max(20).optional(),
  gender: Joi.number().optional(),
  password: Joi.string().max(100).optional(),
});

export const getUserValidation = Joi.string().max(100).required();
