'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cart,Shipping_address}) {
      // define association here
      this.hasMany(Shipping_address,{foreignKey:'user_id',sourceKey:'id',as:'user_address'});

    }
  };
  User.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    status:DataTypes.INTEGER,
    address: DataTypes.STRING,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'users',
    modelName: 'User',
  });
  return User;
};