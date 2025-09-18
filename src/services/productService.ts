import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { CreateProductInterface, UpdateProductInterface } from '../types/productInterface';
import { uploadFile } from '../utils/upload';
import { errorLogger } from '../utils/logger';

export const Product = {
  
  viewAll: async (userId: string, res: Response): Promise<void> => {
  try {
    
    const userExists = await Database.User.findOne({ where: { id: userId } });
    if (!userExists) {
      ResponseService({
        data: null,
        success: false,
        status: 401,
        message: 'Unauthorized Access',
        res,
      });
    }

    
    const productsRaw = await Database.Product.findAll({
      include: [
        {
          model: Database.ProductCategory,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
        {
          model: Database.ProductSubCategory,
          as: 'subCategory',
          attributes: ['id', 'name'],
        },
        {
          model: Database.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Database.Rating,
          as: 'ratings',
          attributes: ['id', 'star', 'review', 'createdAt'],
          include: [
            {
              model: Database.User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      logging: console.log, 
      //where: { isAvailable: true }, 
    });

    
    const products = productsRaw.map((p) => p.toJSON());

    if (!products || products.length === 0) {
      ResponseService({
        data: null,
        success: false,
        status: 404,
        message: 'Products not found',
        res,
      });
    }

    
     ResponseService({
      data: products,
      success: true,
      status: 200,
      message: 'All Products successfully fetched',
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
     ResponseService({
      data: { message, stack },
      success: false,
      status: 500,
      res,
    });
  }
},


  WholesalerViewAll: async (userId: string, res: Response): Promise<void> => {
    try {
      const userExists = await Database.User.findOne({ where: { id: userId } });
      if (!userExists) {
        ResponseService({
          data: null,
          success: false,
          status: 401,
          message: 'Unauthorized Access',
          res,
        });
        return;
      }
      const products = await Database.Product.findAll({
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategory',
            attributes: ['id', 'name'],
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Database.Rating,
            as: 'ratings',
            attributes: ['id', 'star', 'review', 'createdAt'],
            include: [
              {
                model: Database.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        where: {
          userId,
        },
      });
      if (!products || products.length === 0) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Products not found',
          res,
        });
        return;
      }
      ResponseService({
        data: products,
        success: true,
        status: 200,
        message: 'All Products successfully fetched',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  RetailerViewAll: async (res: Response): Promise<void> => {
    try {
      const products = await Database.Product.findAll({
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategory',
            attributes: ['id', 'name'],
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Database.Rating,
            as: 'ratings',
            attributes: ['id', 'star', 'review', 'createdAt'],
            include: [
              {
                model: Database.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        where: {
          isAvailable: true,
        },
      });

      if (!products || products.length === 0) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Products not found',
          res,
        });
        return;
      }
      ResponseService({
        data: products,
        success: true,
        status: 200,
        message: 'All Products successfully fetched',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      }); 
    }
  },

  // Create a new product
  create: async (
    data: CreateProductInterface,
    userID: string,
    files: Express.Multer.File[],
    res: Response,
   
  ): Promise<void> => {
    try {
      const userExists = await Database.User.findOne({ where: { id: userID } });
      if (!userExists) {
        ResponseService({
          data: null,
          success: false,
          status: 401,
          message: 'Unauthorized Access',
          res,
        });
        return;
      }
      const categoryExists = await Database.ProductCategory.findOne({
        where: { id: data.productCatId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 400,
          message: 'Invalid product category ID',
          res,
        });
        return;
      }
      const subCategoryExists = await Database.ProductSubCategory.findOne({
        where: { id: data.productSubCatId },
      });
      if (!subCategoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 400,
          message: 'Invalid product subcategory ID',
          res,
        });
        return;
      }
      let image_urls: string[] = [];

      if (files && files.length > 0) {
        try {
          const uploadPromises = files.map((file) => uploadFile(file));
          image_urls = await Promise.all(uploadPromises);
        } catch (err) {
          const { message, stack } = err as Error;
          ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res,
          });
        }
      }
      const user: string = userExists?.id;
      const {
        name,
        description,
        price,
        stock,
        productCatId,
        productSubCatId,
        expiredAt,
        isAvailable,
      } = data;
      const product = await Database.Product.create({
        name,
        description,
        price,
        stock,
        productCatId,
        productSubCatId,
        userId: user,
        variation: Object.assign({}, data.variation),
        images: image_urls,
        isAvailable,
        expiredAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      ResponseService({
        data: product,
        success: true,
        status: 201,
        message: 'Product successfully created',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // View a single product
  viewSingle: async (dataId: string, res: Response): Promise<void> => {
    try {
      const product = await Database.Product.findOne({
        where: { id: dataId },
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['id', 'name', 'description'],
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategory',
            attributes: ['id', 'name'],
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Database.Rating,
            as: 'ratings',
            attributes: ['id', 'star', 'review', 'createdAt'],
            include: [
              {
                model: Database.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });
      if (!product) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }
      ResponseService({
        data: product,
        success: true,
        status: 200,
        message: 'Product successfully fetched',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // Delete a product
  delete: async (dataId: string, res: Response): Promise<void> => {
    try {
      const productExists = await Database.Product.findOne({ where: { id: dataId } });
      if (!productExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }
      const product = await Database.Product.destroy({ where: { id: dataId } });
      ResponseService({
        data: product,
        success: true,
        status: 200,
        message: 'Product successfully deleted',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // Edit a product
  update: async (
    data: UpdateProductInterface, // Use proper type for type safety
    dataId: string,
    userId: string,
    files: Express.Multer.File[],
    res: Response,
  ): Promise<void> => {
    try {
      const userExists = await Database.User.findOne({ where: { id: userId } });
      if (!userExists) {
        ResponseService({
          data: null,
          success: false,
          status: 401,
          message: 'Unauthorized Access',
          res,
        });
        return;
      }
      const productExists = await Database.Product.findOne({ where: { id: dataId } });
      if (!productExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }

      // Validate category and subcategory if they're being updated
      if (data.productCatId) {
        const categoryExists = await Database.ProductCategory.findOne({
          where: { id: data.productCatId },
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 400,
            message: 'Invalid product category ID',
            res,
          });
          return;
        }
      }

      if (data.productSubCatId) {
        const subCategoryExists = await Database.ProductSubCategory.findOne({
          where: { id: data.productSubCatId },
        });
        if (!subCategoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 400,
            message: 'Invalid product subcategory ID',
            res,
          });
          return;
        }
      }

      let image_urls: string[] = [];

      if (files && files.length > 0) {
        try {
          const uploadPromises = files.map((file) => uploadFile(file));
          image_urls = await Promise.all(uploadPromises);
        } catch (err) {
          const { message, stack } = err as Error;
          ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res,
          });
        }
      }
      // Prepare update data - Sequelize will handle partial updates automatically
      const updateData = { ...data };

      // Only add images if new files were uploaded
      if (image_urls.length > 0) {
        updateData.images = image_urls;
      }

      let updateProduct;
      if (Number(data.stock) === 0) {
        updateProduct = await Database.Product.update(
          {
            ...updateData,
            isAvailable: false,
          },
          {
            where: {
              id: dataId,
            },
          },
        );
      } else {
        updateProduct = await Database.Product.update(
          {
            ...updateData,
            isAvailable: true,
          },
          {
            where: {
              id: dataId,
            },
          },
        );
      }

      ResponseService({
        data: updateProduct,
        success: true,
        status: 200,
        message: 'Product successfully updated',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  checkStock: async (): Promise<void> => {
    try {
      const products = await Database.Product.findAll({
        where: {
          isAvailable: true,
        },
      });

      if (products.length > 0) {
        await Promise.all(
          products.map(async (item) => {
            if (item.stock === 0) {
              await Database.Product.update(
                {
                  isAvailable: false,
                },
                {
                  where: {
                    id: item.id,
                  },
                },
              );
            }
          })
        );
      }
    } catch (err) {
      const { message, stack } = err as Error;
      errorLogger({message, stack} as Error, '[Check product stock service Error]');
    }
  },
};
