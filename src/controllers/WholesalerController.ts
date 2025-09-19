import { Request, Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { hashPassword } from '../utils/helper';
import { EmailService } from '../services/emailService';

export const registerWholesaler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, businessName, phoneNumber, } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

const businessLicenseDocument = files?.['businessLicenseDocument']?.[0]?.path;
const taxCertificate = files?.['taxCertificate']?.[0]?.path;

    if (!businessLicenseDocument) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'business License Document is required',
        res,
      });
    }

    const role = await Database.Role.findOne({ where: { name: 'Wholesaler' } });
    if (!role) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Wholesaler role not found',
        res,
      });
    }

    const existingUser = await Database.User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: 'User already exists',
        res,
      });
    }

    const user = await Database.User.create({
      name,
      email,
      password: await hashPassword(password),
      roleId: role.id,
      businessName,
      phoneNumber,
      status: 'pending',
      businessLicenseDocument,
      taxCertificate,
    });

    // Send email to wholesaler
    await EmailService.sendEmail({
      to: email,
      subject: 'Welcome to Sokolink (Wholesaler Account)',
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Your wholesaler account has been created successfully.</p>
        <p>Our team will review your legal documents. You’ll be notified once approved or rejected.</p>
      `,
    });

    // Notify Admin
    await EmailService.sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Wholesaler Registration',
      html: `
        <h2>Admin Notification</h2>
        <p>A new wholesaler has registered: ${name} (${email})</p>
        <p>They require your approval. Please log in to the dashboard.</p>
      `,
    });

    return ResponseService({
      data: user,
      status: 201,
      success: true,
      message: 'Wholesaler registered successfully, pending approval',
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({ data: { message, stack }, status: 500, success: false, res });
  }
};

export const approveWholesaler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'

    // Get the Wholesaler role
    const wholesalerRole = await Database.Role.findOne({ where: { name: 'Wholesaler' } });
    if (!wholesalerRole) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Wholesaler role not found',
        res,
      });
    }

    // Get the user by ID
    const user = await Database.User.findByPk(id);
    if (!user || user.roleId !== wholesalerRole.id) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Wholesaler not found',
        res,
      });
    }

    //  Approve or reject
    if (action === 'approve') {
      user.status = 'approved';
      await user.save();

      await EmailService.sendEmail({
        to: user.email,
        subject: 'Wholesaler Account Approved',
        html: `<p>Congratulations ${user.name}, your wholesaler account has been approved. You can now list products on Sokolink.</p>`,
      });
    } else if (action === 'reject') {
      user.status = 'rejected';
      (user as any).rejectionReason = reason || 'Not specified';
      await user.save();

      await EmailService.sendEmail({
        to: user.email,
        subject: 'Wholesaler Account Rejected',
        html: `<p>Hello ${user.name}, unfortunately your wholesaler account has been rejected.</p><p>Reason: ${reason || 'Not specified'}</p>`,
      });
    } else {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'Invalid action. Must be "approve" or "reject".',
        res,
      });
    }

    return ResponseService({
      data: user,
      status: 200,
      success: true,
      message: `Wholesaler ${action}d successfully`,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({ data: { message, stack }, status: 500, success: false, res });
  }
};
