'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if carts already exist
    const existing = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM carts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing[0].count > 0) {
      console.log('Carts already seeded. Skipping...');
      return;
    }

    // Seed carts
    const carts = [
      {
        id: uuidv4(),
        userId: 'acc284e1-c124-4c56-80c3-259d18768d0b', // Bob Customer
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: '59b8b530-6d26-479d-b220-371445773cc2', // Sally Seller
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('carts', carts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', null, {});
  },
};
