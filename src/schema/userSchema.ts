import joi from 'joi';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  roleName: joi.string().valid('Retailer', 'Wholesaler', 'Customer').required(),
  businessName: joi.string().required(), 
  phoneNumber: joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(), 
});

export const LoginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const UserParamsSchema = joi.object({
  id: joi.string().min(24),
});
