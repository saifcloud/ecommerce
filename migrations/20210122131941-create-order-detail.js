'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      size_id: {
        type: Sequelize.INTEGER
      },
      color_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE
      },
      qty: {
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('order_details');
  }
};