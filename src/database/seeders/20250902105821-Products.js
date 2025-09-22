'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if any roles already exist
    const products = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM products;`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (products[0].count > 0) {
      console.log('Products already seeded. Skipping...');
      return;
    }

    await queryInterface.bulkInsert(
      'products',
      [
        {
          id: '6f258de1-2138-405a-9a4c-ff7ea7cbc3b0',
          name: 'Samsung Galaxy flips z4',
          description: 'Latest smartphone from Samsung with advanced features',
          price: 999.99,
          stock: 50,
          productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
          productSubCatId: '44f3d9fa-66c7-4708-93bd-14578574480f', // Smartphones
          userId: '59b8b530-6d26-479d-b220-371445773cc2',
          variation: JSON.stringify({
            colors: ['Black', 'White', 'Purple'],
            storage: ['128GB', '256GB', '512GB'],
          }),
          images: [
            'https://pixabay.com/photos/samsung-galaxy-s10-phone-4721543/',
            'https://pixabay.com/photos/samsung-galaxy-s10-phone-4721543/',
          ],
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'b795e83e-738a-4fee-a6ae-5887ec4aea83',
          name: 'iPhone 17 Pro Max',
          description: "Apple's flagship smartphone with titanium design",
          price: 1199.99,
          stock: 0,
          productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
          productSubCatId: '44f3d9fa-66c7-4708-93bd-14578574480f', // Smartphones
          userId: '59b8b530-6d26-479d-b220-371445773cc2',
          variation: JSON.stringify({
            colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium'],
            storage: ['128GB', '256GB', '512GB', '1TB'],
          }),
          images: [
            'https://pixabay.com/photos/smartphone-camera-landscape-nature-6405227/',
            'https://pixabay.com/photos/smartphone-camera-landscape-nature-6405227/',
          ],
          isAvailable: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '665cb50f-d015-4d73-937f-2be9cc0b096f',
          name: 'MacBook Pro 16"',
          description: 'Professional laptop with M3 chip for power users',
          price: 2499.99,
          stock: 15,
          productCatId: '0ddbea7e-6e69-4bd0-a1b1-7bf0275ebfbe', // Electronics
          productSubCatId: '37bd634e-df79-4eba-a830-26da92dcc9e6', // Laptops
          userId: '59b8b530-6d26-479d-b220-371445773cc2',
          variation: JSON.stringify({
            colors: ['Space Gray', 'Silver'],
            memory: ['18GB', '36GB'],
            storage: ['512GB', '1TB', '2TB'],
          }),
          images: [
            'https://pixabay.com/photos/macbook-pro-adapter-usb-c-macbook-2381729/',
            'https://pixabay.com/photos/macbook-pro-adapter-usb-c-macbook-2381729/',
          ],
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a7e481fc-e04e-4c56-93d4-f890b20681c1',
          name: "Men's Cotton T-Shirt",
          description: 'Comfortable cotton t-shirt for everyday wear',
          price: 24.99,
          stock: 100,
          productCatId: 'c840fa32-4331-423e-a849-c70e48700111', // Clothing
          productSubCatId: '187abcad-68d6-4221-8e64-c9ee33448917', // Men's Clothing
          userId: 'dd83607b-cb78-4eee-a0c8-64bc8dfe1e44',
          variation: JSON.stringify({
            colors: ['White', 'Black', 'Navy', 'Gray'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          }),
          images: [
            'https://pixabay.com/photos/t-shirt-white-t-shirt-t-shirt-mockup-9611374/',
            'https://pixabay.com/photos/beer-monster-t-shirt-tshirt-funny-792100/',
          ],
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'b2acdd3b-1807-4772-8a4c-82614ea283a7',
          name: 'JavaScript: The Complete Guide',
          description: 'Comprehensive guide to modern JavaScript programming',
          price: 49.99,
          stock: 75,
          productCatId: 'a4a61c4d-2b57-469f-9386-4c88c13bea24', // Books
          productSubCatId: '01100301-3a4c-4d97-9023-4f839bb991c9', // Technical
          userId: 'dd83607b-cb78-4eee-a0c8-64bc8dfe1e44',
          variation: JSON.stringify({
            format: ['Paperback', 'Hardcover', 'E-book'],
            language: ['English'],
          }),
          images: ['https://pixabay.com/photos/technology-computer-code-javascript-1283624/', 'https://pixabay.com/photos/coding-programming-css-html-php-4570799/'],
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};