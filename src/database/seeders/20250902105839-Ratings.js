'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Example: dynamically generated ratings
    await queryInterface.bulkInsert('ratings', [
      {
        id: uuidv4(), 
        star: 5,
        postedBy: 'af4357d9-72a9-45d7-a288-4fcfbb59fc9f', // still reference user UUID
        productId: '6f258de1-2138-405a-9a4c-ff7ea7cbc3b0', // still reference product UUID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        star: 3,
        postedBy: 'acc284e1-c124-4c56-80c3-259d18768d0b',
        productId: 'b795e83e-738a-4fee-a6ae-5887ec4aea83',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // add more ratings if needed
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ratings', null, {});
  }
};
