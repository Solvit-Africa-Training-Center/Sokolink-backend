import joi from 'joi';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  roleName: joi.string().valid('Retailer', 'Wholeseller', 'Customer').required(),
  businessName: joi.string().required(), 
  phoneNumber: joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(), 
});  

// Retailer registration
export const AddRetailerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  roleName: joi.string().valid('Retailer').required(),
  phoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required(),
  businessName: joi.string().optional(),
  taxNumber: joi.string().optional(),
  businessAddress: joi.string().optional(),
  businessLicenseNumber: joi.string().optional(),
  businessLicenseDocument: joi.string().optional(),
  taxCertificate: joi.string().optional(),
});

export const AddWholesalerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  roleName: joi.string().valid('Wholesaler').optional(),
  phoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required(),
  businessName: joi.string().required(),
  taxNumber: joi.string().required(),
  businessAddress: joi.string().required(),
  businessLicenseNumber: joi.string().required(),
  businessLicenseDocument: joi.string().optional(),
  taxCertificate: joi.string().optional(),
});

export const ReviewWholesalerSchema = joi.object({
  action: joi.string().valid('approve', 'reject').required(),
  message: joi.string().allow('').optional(), // optional reason
});

export const LoginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const UserParamsSchema = joi.object({
  id: joi.string().min(24),
});
