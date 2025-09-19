import { Router } from "express";

// ✅ Controller functions for admin routes
import {
  adminLogin,
  listWholesalers,
  approveWholesaler,
  rejectWholesaler,
  listRetailers,
  listAllProducts,
  updateUser,
  deleteUser,
} from "../controllers/adminController"; // adjust path if needed

// ✅ Middleware
import { authMiddleware } from "../middlewares/authMiddleware";

// const router = Router();
const  adminRoutes = Router();

adminRoutes.post('/admin/login', adminLogin);
adminRoutes.get('/admin/wholesalers',listWholesalers);
adminRoutes.patch('/admin/wholesaler/:id/approve', authMiddleware, approveWholesaler);
adminRoutes.patch('/admin/wholesaler/:id/reject', authMiddleware, rejectWholesaler);
adminRoutes.get('/admin/retailers', authMiddleware,listRetailers);
adminRoutes.get('/admin/products', authMiddleware, listAllProducts);
// Update Wholesaler or Retailer
adminRoutes.put('/admin/user/:id', authMiddleware, updateUser);

// Delete Wholesaler or Retailer
adminRoutes.delete('/admin/user/:id', authMiddleware, deleteUser);

export { adminRoutes };