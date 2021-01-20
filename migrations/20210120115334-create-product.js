'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING,
        defaultValue:'default.png'
      },
      product_name: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      subcategory_id: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.STRING
      },
      brand: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE(10,2)
      },
      description: {
        type: Sequelize.TEXT
      },
      discount: {
        type: Sequelize.STRING
      },
      price_after_discount: {
        type: Sequelize.DOUBLE(10,2)
      },
      limited_time: {
        type: Sequelize.INTEGER
      },
      host_selling: {
        type: Sequelize.INTEGER
      },
      stock: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue:1,
        comment:'1=>active'
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
    await queryInterface.dropTable('products');
  }
};