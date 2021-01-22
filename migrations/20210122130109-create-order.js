'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      total_order: {
        type: Sequelize.STRING
      },
      coupon_discount: {
        type: Sequelize.DOUBLE
      },
      total_amount: {
        type: Sequelize.DOUBLE
      },
      payment_status: {
        type: Sequelize.INTEGER
      },
      delivery_status: {
        type: Sequelize.INTEGER
      },
      delivery_date: {
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
    await queryInterface.dropTable('orders');
  }
};