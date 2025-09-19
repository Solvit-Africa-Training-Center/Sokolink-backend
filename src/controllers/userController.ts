import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { GetAllUsers, UserInterface } from '../types/userInterface';
import { Database } from '../database';
import { IRequestUser } from '../middlewares/authMiddleware';
import { comparePassword, destroyToken, generateToken, hashPassword } from '../utils/helper';
import { EmailService } from '../services/emailService';
import { User } from '../database/models/Users';

interface IRequestUserData extends Request {
  body: UserInterface;
}

export const getAllUsers = async (req: IRequestUserData, res: Response) => {
  try {
    const users = await Database.User.findAll();
    if (!users) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: 'No users found',
        res,
      });
    }

    ResponseService<GetAllUsers>({
      data: { users },
      status: 200,
      success: true,
      message: 'Users retrieved successfully',
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

export const registerUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { name, email, password, roleName, businessName, phoneNumber, } = req.body;
    const businessLicenseDocument = req.file?.path || '';

    if (!roleName) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'roleName is required',
        res,
      });
    }

    const role = await Database.Role.findOne({ where: { name: roleName } });
    if (!role) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: `Role "${roleName}" not found`,
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
     const status = 'pending';
    const user = await Database.User.create({
      name,
      email,
      password: await hashPassword(password),
      roleId: role.id,
      businessName,
      phoneNumber,
      status,
      businessLicenseDocument,
    });

    
    await user.save();

     // ✅ Send role-specific welcome email
    let emailHtml = '';

    if (roleName.toLowerCase() === 'wholesaler') {
      emailHtml = `
        <h2>Welcome ${name}!</h2>
        <p>Your ${roleName} account has been created successfully.</p>
        <p>Thank you for registering on the Sokolink platform.</p>
        <p>You can now submit your business legal documents. Once approved, you will be notified and allowed to start your business on the Sokolink platform.</p>
      `;
    } else if (roleName.toLowerCase() === 'retailer') {
      emailHtml = `
        <h2>Welcome ${name}!</h2>
        <p>Your ${roleName} account has been created successfully.</p>
        <p>Thank you for registering on the Sokolink platform.</p>
        <p>You can now log in to our platform and start shopping.</p>
      `;
    } else {
      emailHtml = `
        <h2>Welcome ${name}!</h2>
        <p>Your ${roleName} account has been created successfully.</p>
        <p>Thank you for registering on the Sokolink platform.</p>
      `;
    }

    await EmailService.sendEmail({
      to: email,
      subject: `Welcome to Sokolink, ${roleName}!`,
      html: emailHtml,
    });

    ResponseService({
      data: user,
      message: `${roleName} account created successfully`,
      success: true,
      status: 201,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

export const loginUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Database.User.findOne({ where: { email } });
    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'User not found',
        res,
      });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: 'Invalid email or password',
        res,
      });
    }

    const token = await generateToken({ id: user.id, email: user.email, role: user.roleId });

    // Fetch role name from Role table
    const role = await Database.Role.findOne({ where: { id: user.roleId } });
    const roleName = role?.name || 'User';

 // ✅ Role-specific login confirmation email
    let loginHtml = '';

    if (roleName.toLowerCase() === 'wholesaler') {
      loginHtml = `
        <h2>Hello ${user.name}!</h2>
        <p>You have been successfully logged in to the Sokolink platform.</p>
        <p>Submit your business legal documents. Once submitted, our team will verify them. Once approved, you'll be notified and can start your business on Sokolink.</p>
      `;
    } else if (roleName.toLowerCase() === 'retailer') {
      loginHtml = `
        <h2>Hello ${user.name}!</h2>
        <p>You have been successfully logged in to the Sokolink platform.</p>
        <p>You can now start shopping for products on our platform.</p>
      `;
    } else {
      loginHtml = `
        <h2>Hello ${user.name}!</h2>
        <p>You have been successfully logged in to the Sokolink platform.</p>
      `;
    }

    await EmailService.sendEmail({
      to: email,
      subject: `Login Confirmation - ${roleName}`,
      html: loginHtml,
    });

    ResponseService({
      data: { token },
      status: 200,
      success: true,
      message: 'Login successful',
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

export const logoutUser = async (req: IRequestUser, res: Response) => {
  try {
    const token = req.token;

    await destroyToken(token);

    ResponseService({
      data: null,
      status: 200,
      success: true,
      message: 'Logout successful',
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};


// Use IRequestUser so req.user has roleId
export const deleteUser = async (req: IRequestUser, res: Response) => {
  try {
    const { id } = req.params; // ID of the user to delete

    // ✅ Check if the requester is authenticated
    if (!req.user) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: 'Access denied: User information missing',
        res,
      });
    }

    // ✅ Check if the requester has a roleId
    if (!req.user.role) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: 'Access denied: User role missing',
        res,
      });
    }

    // ✅ Fetch role of the requester
    const requesterRole = await Database.Role.findOne({ where: { id: req.user.role} });
    if (!requesterRole || requesterRole.name.toLowerCase() !== 'admin') {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: 'Access denied: Only admins can delete users',
        res,
      });
    }

    // ✅ Fetch the user to delete
    const user = await Database.User.findByPk(id);
    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'User not found',
        res,
      });
    }

    // ✅ Delete the user
    await user.destroy();

    ResponseService({
      data: null,
      status: 200,
      success: true,
      message: 'User deleted successfully',
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};