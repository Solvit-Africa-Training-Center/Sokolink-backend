'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add other columns except legalDocument
    await queryInterface.addColumn('users', 'taxNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'businessAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'businessLicenseNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'businessLicenseDocument', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'taxCertificate', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns
    await queryInterface.removeColumn('users', 'taxNumber');
    await queryInterface.removeColumn('users', 'businessAddress');
    await queryInterface.removeColumn('users', 'businessLicenseNumber');
    await queryInterface.removeColumn('users', 'businessLicenseDocument');
    await queryInterface.removeColumn('users', 'taxCertificate');
  }
};
