'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.INTEGER
      },
      color: {
        type: Sequelize.INTEGER
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE(10,2)
      },
      price_after_discount: {
        type: Sequelize.DOUBLE(10,2)
      },
      total: {
        type: Sequelize.DOUBLE(10,2)
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue:1,
        comment:"1=>active",
      },
      is_deleted: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        comment:"1=>deleted"
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
    await queryInterface.dropTable('carts');
  }
};