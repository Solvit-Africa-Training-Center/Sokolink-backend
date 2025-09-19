import { Request, Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { hashPassword } from '../utils/helper';
import { EmailService } from '../services/emailService';

export const registerRetailer = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, businessName, status, businessLicenseDocument } = req.body;

    const role = await Database.Role.findOne({ where: { name: 'Retailer' } });
    if (!role) {
      return ResponseService({ data: null, status: 404, success: false, message: 'Retailer role not found', res });
    }

    const existingUser = await Database.User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseService({ data: null, status: 409, success: false, message: 'User already exists', res });
    }

    const user = await Database.User.create({
      name,
      email,
      password: await hashPassword(password),
      roleId: role.id,
      phoneNumber,
      businessName: businessName || undefined, // optional
      status: status || undefined,             // optional
      businessLicenseDocument: businessLicenseDocument || undefined, // optional
    });

    // Send welcome email
    await EmailService.sendEmail({
      to: email,
      subject: 'Welcome to Sokolink (Retailer Account)',
      html: `<h2>Welcome ${name}!</h2><p>Your retailer account has been created successfully. You can now log in and start shopping.</p>`,
    });

    return ResponseService({ data: user, status: 201, success: true, message: 'Retailer registered successfully', res });
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({ data: { message, stack }, status: 500, success: false, res });
  }
};
