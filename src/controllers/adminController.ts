import { Request, Response } from 'express';
import { User } from '../database/models/Users';
import { Role } from '../database/models/Roles';
import { Product } from '../database/models/Products';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/helper';


// Admin login using User table + admin role
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Get admin role ID
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) return res.status(500).json({ message: 'Admin role not found in database' });

    // 2️⃣ Find user with admin role
    const user = await User.findOne({
      where: { email, roleId: adminRole.id },
      include: [{ model: Role, as: 'role' }],
    });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // 3️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 4️⃣ Generate JWT token using role UUID
    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.roleId, // ✅ use role ID (UUID) instead of name
    });

    // 5️⃣ Send token and user info
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// List all wholesalers
export const listWholesalers = async (req: Request, res: Response) => {
  try {
    const wholesalers = await User.findAll({
      include: [{ model: Role, as: 'role' }], // include role without filter
      where: { '$role.name$': 'Wholesaler' },  // filter using alias path
      attributes: ['id', 'name', 'email', 'status', 'businessLicenseDocument'],
    });

    res.json(wholesalers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Approve a wholesaler
export const approveWholesaler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wholesaler = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
    const role = wholesaler ? wholesaler.get('role') as Role : null;
    if (!wholesaler || !role || (role as any).name !== 'wholesaler') return res.status(404).json({ message: 'Wholesaler not found' });

    wholesaler.status = 'approved';
    await wholesaler.save();

    // Send approval email
    await sendEmail(wholesaler.email, 'Wholesaler Approved', 'Your account has been approved.');

    res.json({ message: 'Wholesaler approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Reject a wholesaler
export const rejectWholesaler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wholesaler = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
    const role = wholesaler ? wholesaler.get('role') as Role : null;
    if (!wholesaler || !role || (role as any).name !== 'wholesaler') return res.status(404).json({ message: 'Wholesaler not found' });

    wholesaler.status = 'rejected';
    await wholesaler.save();

    // Send rejection email
    await sendEmail(wholesaler.email, 'Wholesaler Rejected', 'Your account has been rejected.');

    res.json({ message: 'Wholesaler rejected successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// List all retailers
export const listRetailers = async (req: Request, res: Response) => {
  try {
    const retailers = await User.findAll({
      include: [{ model: Role, as: 'role' }], // include role without filter
      where: { '$role.name$': 'Retailer' },  // filter using alias path
      attributes: ['id', 'name', 'email',],
    });

    res.json(retailers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// List all products (optionally filter by wholesaler or status)
export const listAllProducts = async (req: Request, res: Response) => {
  try {
    const { wholesalerId, status } = req.query;

    const filter: any = {};
    if (wholesalerId) filter.wholesalerId = wholesalerId;
    if (status) filter.status = status;

    const products = await Product.findAll({ where: filter });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Update Wholesaler or Retailer account
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, status, businessName, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

   const role = (user.get('role') as Role) || null;
const roleName = role?.name;

if (!role || (roleName !== 'Wholesaler' && roleName !== 'Retailer')) {
  return res.status(403).json({ message: 'Can only update Wholesaler or Retailer accounts' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (status) user.status = status;
    if (businessName && roleName === 'Wholesaler') user.businessName = businessName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.json({ message: `${roleName} updated successfully`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Delete Wholesaler or Retailer account
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const role = (user.get('role') as Role) || null;
    const roleName = role?.name;
    if (roleName !== 'Wholesaler' && roleName !== 'Retailer') {
      return res.status(403).json({ message: 'Can only delete Wholesaler or Retailer accounts' });
    }

    await user.destroy();
    res.json({ message: `${roleName} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Simple email sender
const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Admin" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};


