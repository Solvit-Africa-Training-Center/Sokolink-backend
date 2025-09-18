'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all carts
    const carts = await queryInterface.sequelize.query(
      `SELECT id FROM carts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get all products
    const products = await queryInterface.sequelize.query(
      `SELECT id, price FROM products ORDER BY name;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!carts.length || !products.length) {
      throw new Error('No carts or products found. Please seed them first.');
    }

    const cartItems = [];

    // Assign products for each cart (example)
    // Bob (first cart) gets first two products
    cartItems.push({
      id: uuidv4(),
      cartId: carts[0].id,
      productId: products[0].id,
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    cartItems.push({
      id: uuidv4(),
      cartId: carts[0].id,
      productId: products[1].id,
      quantity: 1,
      price: products[1].price,
      totalprice: parseFloat((products[1].price * 1).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sally (second cart) gets third and fourth products if available
    if (carts[1] && products[2]) {
      cartItems.push({
        id: uuidv4(),
        cartId: carts[1].id,
        productId: products[2].id,
        quantity: 1,
        price: products[2].price,
        totalprice: parseFloat((products[2].price * 1).toFixed(2)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (carts[1] && products[3]) {
      cartItems.push({
        id: uuidv4(),
        cartId: carts[1].id,
        productId: products[3].id,
        quantity: 3,
        price: products[3].price,
        totalprice: parseFloat((products[3].price * 3).toFixed(2)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert all cart items
    await queryInterface.bulkInsert('cart_items', cartItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cart_items', null, {});
  },
};
