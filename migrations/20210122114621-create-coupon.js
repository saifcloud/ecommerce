'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      min_purchase: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.STRING
      },
      uses: {
        type: Sequelize.STRING
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue:1,
        comment:'1=>active'
      },
      is_deleted: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        comment:'1=>deleted'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupons');
  }
};