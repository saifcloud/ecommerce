'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
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
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone:{
        type:Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      status:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        comment:"1=>verified"
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
    await queryInterface.dropTable('users');
  }
};