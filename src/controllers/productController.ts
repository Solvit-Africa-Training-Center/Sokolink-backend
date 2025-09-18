import { Request, Response } from 'express';
import { Product } from '../services/productService';
import { ProductCategory } from '../services/productCategoryService';
import { ProductSubCategory } from '../services/productSubCategoryService';
import { ProductIdRequest, ProductRequest } from '../types/productInterface';
import { ProductCategoryIdRequest, ProductCategoryRequest } from '../types/productCatInterface';
import {

  ProductSubCategoryIdRequest,
  ProductSubCategoryRequest,
  
} from '../types/productSubInterface';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';

export class ProductController {
  // Product catgories
  public async viewAllCategories(req: Request, res: Response): Promise<void> {
    try {
      ProductCategory.viewAll(res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async createCategory(req: ProductCategoryRequest, res: Response): Promise<void> {
    try {
      ProductCategory.create(req.body, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      ProductCategory.viewSingle(name, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteCategory(req: ProductCategoryIdRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      ProductCategory.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateCategory(req: ProductCategoryRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      ProductCategory.update(req.body, id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  // sub-category
  public async viewAllSubCategories(req: Request, res: Response): Promise<void> {
    try {
      ProductSubCategory.viewAll(res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async createSubCategory(req: ProductSubCategoryRequest, res: Response): Promise<void> {
    try {
      ProductSubCategory.create(req.body, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      ProductSubCategory.viewSingle(name, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteSubCategory(req: ProductSubCategoryIdRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      ProductSubCategory.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateSubCategory(req: ProductSubCategoryRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      ProductSubCategory.update(req.body, id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  // Products
  public async viewAllProducts(req: IRequestUser, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      Product.viewAll(user, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async WholesalerViewAllProducts(req: IRequestUser, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      Product.WholesalerViewAll(user, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

public async retailerViewAllProducts(req: Request, res: Response): Promise<void> {
  try {
    Product.RetailerViewAll(res);
  } catch (err) {
    const { message, stack } = err as Error;
    ResponseService({
      data: { message, stack },
      success: false,
      status: 500,
      res,
    });
  }
}

  public async createProduct(req: ProductRequest, res: Response): Promise<void> {
    try {
      const user = req?.user?.id as string;
      const userRole = req?.user?.role as string;
      const { files } = req;
      Product.create(req.body, user, files as Express.Multer.File[], res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      Product.viewSingle(id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteProduct(req: ProductIdRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      Product.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateProduct(req: ProductRequest, res: Response): Promise<void> {
    try {
      const userId = req?.user?.id as string;
      const userRole = req?.user?.role as string;
      const { id } = req.params;
      const { files } = req;
      Product.update(req.body, id, userId, files as Express.Multer.File[], res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }
}
