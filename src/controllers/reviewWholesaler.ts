import { Request, Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { EmailService } from '../services/emailService';

export const reviewWholesaler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, message } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return ResponseService({ 
        data: null, 
        status: 400, 
        success: false, 
        message: 'Action must be "approve" or "reject"', 
        res 
      });
    }

    const wholesaler = await Database.User.findByPk(id);

    if (!wholesaler || wholesaler.roleId !== (await Database.Role.findOne({ where: { name: 'Wholeseller' } }))?.id) {
      return ResponseService({ 
        data: null, 
        status: 404, 
        success: false, 
        message: 'Wholesaler not found', 
        res 
      });
    }

    if (wholesaler.status !== 'pending') {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'Wholesaler has already been reviewed',
        res
      });
    }

    // Update status
    wholesaler.status = action === 'approve' ? 'approved' : 'rejected';
    await wholesaler.save();

    // Send email
    await EmailService.sendEmail({
      to: wholesaler.email,
      subject: `Your Wholesaler Account Has Been ${action.toUpperCase()}`,
      html: `
        <h2>Hello ${wholesaler.name}</h2>
        <p>Your account has been <strong>${action}</strong>.</p>
        ${message ? `<p>Message from admin: ${message}</p>` : ''}
        ${action === 'reject' ? '<p>Please review your documents and try again.</p>' : ''}
        <p>Thank you for using SokoLink!</p>
      `,
    });

    return ResponseService({
      data: wholesaler,
      status: 200,
      success: true,
      message: `Wholesaler ${action}ed successfully`,
      res,
    });
  } catch (error) {
    return ResponseService({ 
      data: { message: (error as Error).message }, 
      status: 500, 
      success: false, 
      res 
    });
  }
};
