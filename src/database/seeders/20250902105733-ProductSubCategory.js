'use strict';

const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if any roles already exist
    const productSubCategories = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM product_sub_categories;`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (productSubCategories[0].count > 0) {
      console.log('Product sub-categories already seeded. Skipping...');
      return;
    }
    const subCategories = [
      // Electronics subcategories
      {
        id: '44f3d9fa-66c7-4708-93bd-14578574480f', // Smartphones
        name: 'Smartphones',
        productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '37bd634e-df79-4eba-a830-26da92dcc9e6',
        name: 'Laptops',
        productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b248e043-f6ee-486e-87b8-85289176d28b',
        name: 'Tablets',
        productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Clothing subcategories
      {
        id: '187abcad-68d6-4221-8e64-c9ee33448917',
        name: "Men's Clothing",
        productCatId: 'c840fa32-4331-423e-a849-c70e48700111', // Clothing
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '61df62ed-fd41-4a02-be1a-1ab64fe4d2f5',
        name: "Women's Clothing",
        productCatId: 'c840fa32-4331-423e-a849-c70e48700111', // Clothing
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Books subcategories
      {
        id: '055a86e4-c4fa-40f4-9a5a-2a8c3fe1a6eb',
        name: 'Fiction',
        productCatId: 'a4a61c4d-2b57-469f-9386-4c88c13bea24', // Books
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '01100301-3a4c-4d97-9023-4f839bb991c9',
        name: 'Technical',
        productCatId: 'a4a61c4d-2b57-469f-9386-4c88c13bea24', // Books
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Home & Garden subcategories
      {
        id: 'd7b1461e-aaa1-47d5-8563-ef5d13b57855',
        name: 'Furniture',
        productCatId: '762cd95b-1840-4261-98d0-01e35626d8b7', // Home & Garden
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '690c91fb-b8e7-400b-ae81-a7ee07add23c',
        name: 'Garden Tools',
        productCatId: '762cd95b-1840-4261-98d0-01e35626d8b7', // Home & Garden
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('product_sub_categories', subCategories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_sub_categories', null, {});
  },
};