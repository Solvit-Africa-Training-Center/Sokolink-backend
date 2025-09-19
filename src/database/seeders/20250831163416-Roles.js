'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if any roles already exist
    const roles = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM roles;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (roles[0].count > 0) {
      console.log('Roles already seeded. Skipping...');
      return;
    }

    // Proceed with seeding roles
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'Admin',
        description: 'Platform administrator with full access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Retailer',
        description: 'Regular shopper with access to browse and purchase',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Wholesaler',
        description: 'Vendor with permission to manage their products and orders',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
       {
        id: uuidv4(),
        name: 'Customer',
        description: 'Regular buyer with access to browse and purchase',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
