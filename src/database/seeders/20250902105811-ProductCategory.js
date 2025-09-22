'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if any roles already exist
    const productCategories = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM product_categories;`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (productCategories[0].count > 0) {
      console.log('Product categories already seeded. Skipping...');
      return;
    }

    const categories = [
      {
        id: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c840fa32-4331-423e-a849-c70e48700111', // Clothing
        name: 'Clothing',
        description: 'Fashion and apparel items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'a4a61c4d-2b57-469f-9386-4c88c13bea24', // Books
        name: 'Books',
        description: 'Books and educational materials',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '762cd95b-1840-4261-98d0-01e35626d8b7', // Home & Garden
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('product_categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  },
};