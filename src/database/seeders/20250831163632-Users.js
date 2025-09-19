'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM users;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (user[0].count > 0) {
      console.log('Users already seeded. Skipping...');
      return;
    }

    // Retrieve existing roles
    const roles = await queryInterface.sequelize.query(`SELECT id, name FROM roles;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const getRoleId = (roleName) => {
      const role = roles.find((r) => r.name === roleName);
      if (!role) {
        throw new Error(`Role '${roleName}' not found. Make sure it is seeded before users.`);
      }
      return role.id;
    };

    const users = [
      {
        id: 'af4357d9-72a9-45d7-a288-4fcfbb59fc9f',
        name: 'Reverien',
        email: 'reverien@admin.com',
        roleId: getRoleId('Admin'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'acc284e1-c124-4c56-80c3-259d18768d0b',
        name: 'Bob Retailler',
        email: 'bob@customer.com',
        roleId: getRoleId('Retailer'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '59b8b530-6d26-479d-b220-371445773cc2',
        name: 'Sally Wholesaler',
        email: 'sally@seller.com',
        roleId: getRoleId('Wholesaler'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'dd83607b-cb78-4eee-a0c8-64bc8dfe1e44',
        name: 'Alice wholesaler',
        email: 'alice@seller.com',
        roleId: getRoleId('Wholesaler'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};